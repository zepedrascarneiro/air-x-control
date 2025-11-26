import { NextRequest, NextResponse } from 'next/server';
import { stripe, PLANS, PlanType } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { 
  sendPaymentConfirmedEmail, 
  sendPaymentFailedEmail,
  sendSubscriptionCanceledEmail 
} from '@/lib/email';
import Stripe from 'stripe';

// Desabilita o body parser padrão do Next.js
export const runtime = 'nodejs';

/**
 * POST /api/stripe/webhook
 * Recebe eventos do Stripe (webhooks)
 */
export async function POST(request: NextRequest) {
  if (!stripe) {
    console.error('[Webhook] Stripe not configured');
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('[Webhook] STRIPE_WEBHOOK_SECRET not configured');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('[Webhook] Signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  console.log('[Webhook] Received event:', event.type);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log('[Webhook] Unhandled event type:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Webhook] Error processing event:', error);
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 });
  }
}

/**
 * Processa checkout concluído
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const organizationId = session.metadata?.organizationId;
  const subscriptionId = session.subscription as string;

  if (!organizationId || !subscriptionId) {
    console.error('[Webhook] Missing metadata in checkout session');
    return;
  }

  // Atualiza a organização com a subscription
  await prisma.organization.update({
    where: { id: organizationId },
    data: {
      stripeSubscriptionId: subscriptionId,
      stripeCustomerId: session.customer as string,
    },
  });

  console.log('[Webhook] Checkout completed for org:', organizationId);
}

/**
 * Processa atualização de subscription
 */
async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const organizationId = subscription.metadata?.organizationId;

  if (!organizationId) {
    // Tenta encontrar pelo customer ID
    const org = await prisma.organization.findFirst({
      where: { stripeCustomerId: subscription.customer as string },
    });

    if (!org) {
      console.error('[Webhook] Organization not found for subscription');
      return;
    }

    await updateOrganizationSubscription(org.id, subscription);
  } else {
    await updateOrganizationSubscription(organizationId, subscription);
  }
}

/**
 * Atualiza dados da subscription na organização
 */
async function updateOrganizationSubscription(
  organizationId: string,
  subscription: Stripe.Subscription
) {
  // Determina o plano baseado no price ID
  const priceId = subscription.items.data[0]?.price.id;
  let plan: PlanType = 'FREE';

  for (const [key, value] of Object.entries(PLANS)) {
    if (value.priceId === priceId) {
      plan = key as PlanType;
      break;
    }
  }

  const subData = JSON.parse(JSON.stringify(subscription));
  const periodEnd = subData.current_period_end 
    ? new Date(subData.current_period_end * 1000) 
    : null;

  await prisma.organization.update({
    where: { id: organizationId },
    data: {
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      subscriptionStatus: subscription.status,
      subscriptionPeriodEnd: periodEnd,
      plan: plan,
      status: subscription.status === 'active' ? 'ACTIVE' : 'SUSPENDED',
    },
  });

  console.log('[Webhook] Subscription updated for org:', organizationId, 'Plan:', plan);
}

/**
 * Processa subscription cancelada
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const org = await prisma.organization.findFirst({
    where: { stripeSubscriptionId: subscription.id },
    include: {
      members: {
        where: { role: 'OWNER' },
        include: { user: true },
        take: 1,
      },
    },
  });

  if (!org) {
    console.error('[Webhook] Organization not found for deleted subscription');
    return;
  }

  const previousPlan = org.plan;

  await prisma.organization.update({
    where: { id: org.id },
    data: {
      plan: 'FREE',
      subscriptionStatus: 'canceled',
      stripeSubscriptionId: null,
      stripePriceId: null,
    },
  });

  console.log('[Webhook] Subscription canceled for org:', org.id);

  // Enviar email de cancelamento
  const owner = org.members[0]?.user;
  if (owner) {
    const planConfig = PLANS[previousPlan as PlanType] || PLANS.PRO;
    const subData = JSON.parse(JSON.stringify(subscription));
    const endDate = subData.current_period_end 
      ? new Date(subData.current_period_end * 1000).toLocaleDateString('pt-BR')
      : new Date().toLocaleDateString('pt-BR');

    await sendSubscriptionCanceledEmail(
      owner.email,
      owner.name,
      planConfig.name,
      endDate,
      true // immediate cancellation via webhook
    );
  }
}

/**
 * Processa pagamento bem-sucedido
 */
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const invoiceData = JSON.parse(JSON.stringify(invoice));
  const subscriptionId = invoiceData.subscription as string;
  
  if (!subscriptionId) return;

  const org = await prisma.organization.findFirst({
    where: { stripeSubscriptionId: subscriptionId },
    include: {
      members: {
        where: { role: 'OWNER' },
        include: { user: true },
        take: 1,
      },
    },
  });

  if (org) {
    await prisma.organization.update({
      where: { id: org.id },
      data: {
        status: 'ACTIVE',
        subscriptionStatus: 'active',
      },
    });

    console.log('[Webhook] Payment succeeded for org:', org.id);

    // Enviar email de confirmação de pagamento
    const owner = org.members[0]?.user;
    if (owner) {
      const planConfig = PLANS[org.plan as PlanType] || PLANS.PRO;
      const nextBilling = invoiceData.lines?.data?.[0]?.period?.end;
      const nextBillingDate = nextBilling 
        ? new Date(nextBilling * 1000).toLocaleDateString('pt-BR')
        : 'N/A';

      await sendPaymentConfirmedEmail(
        owner.email,
        owner.name,
        planConfig.name,
        invoiceData.amount_paid || 0,
        nextBillingDate
      );
    }
  }
}

/**
 * Processa falha de pagamento
 */
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const invoiceData = JSON.parse(JSON.stringify(invoice));
  const subscriptionId = invoiceData.subscription as string;
  
  if (!subscriptionId) return;

  const org = await prisma.organization.findFirst({
    where: { stripeSubscriptionId: subscriptionId },
    include: {
      members: {
        where: { role: 'OWNER' },
        include: { user: true },
        take: 1,
      },
    },
  });

  if (org) {
    await prisma.organization.update({
      where: { id: org.id },
      data: {
        subscriptionStatus: 'past_due',
      },
    });

    console.log('[Webhook] Payment failed for org:', org.id);
    
    // Enviar email de falha no pagamento
    const owner = org.members[0]?.user;
    if (owner) {
      const planConfig = PLANS[org.plan as PlanType] || PLANS.PRO;
      await sendPaymentFailedEmail(owner.email, owner.name, planConfig.name);
    }
  }
}
