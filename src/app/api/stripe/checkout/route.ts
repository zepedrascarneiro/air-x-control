import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { 
  stripe, 
  getOrCreateStripeCustomer, 
  createCheckoutSession,
  PLANS,
  PlanType 
} from '@/lib/stripe';

export const dynamic = 'force-dynamic';

/**
 * POST /api/stripe/checkout
 * Cria uma sessão de checkout para upgrade de plano
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    const body = await request.json();
    const { plan } = body as { plan: PlanType };

    // Valida o plano
    if (!plan || !PLANS[plan] || plan === 'FREE') {
      return NextResponse.json(
        { error: 'Plano inválido' },
        { status: 400 }
      );
    }

    const planConfig = PLANS[plan];
    if (!planConfig.priceId) {
      return NextResponse.json(
        { error: 'Plano não configurado. Por favor, configure STRIPE_PRO_PRICE_ID e STRIPE_ENTERPRISE_PRICE_ID.' },
        { status: 400 }
      );
    }

    // Se usuário não está logado, redireciona para checkout com link para criar conta depois
    if (!user) {
      if (!stripe) {
        return NextResponse.json(
          { error: 'Stripe não configurado' },
          { status: 500 }
        );
      }

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: planConfig.priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${appUrl}/register?success=true&plan=${plan}`,
        cancel_url: `${appUrl}/pricing?canceled=true`,
        allow_promotion_codes: true,
        billing_address_collection: 'auto',
      });

      return NextResponse.json({ url: session.url });
    }

    // Obtém a organização do usuário
    const membership = await prisma.organizationMember.findFirst({
      where: { 
        userId: user.id,
        role: { in: ['OWNER', 'ADMIN'] },
      },
      include: { organization: true },
    });

    if (!membership) {
      return NextResponse.json(
        { error: 'Você não tem permissão para gerenciar o plano' },
        { status: 403 }
      );
    }

    const organization = membership.organization;

    // Obtém ou cria customer no Stripe
    let customerId = organization.stripeCustomerId;
    if (!customerId) {
      customerId = await getOrCreateStripeCustomer(
        user.email,
        organization.name,
        organization.id
      );

      if (customerId) {
        await prisma.organization.update({
          where: { id: organization.id },
          data: { stripeCustomerId: customerId },
        });
      }
    }

    if (!customerId) {
      return NextResponse.json(
        { error: 'Erro ao criar conta de pagamento' },
        { status: 500 }
      );
    }

    // Cria sessão de checkout
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const checkoutUrl = await createCheckoutSession(
      customerId,
      planConfig.priceId,
      organization.id,
      `${appUrl}/settings?success=true&plan=${plan}`,
      `${appUrl}/pricing?canceled=true`
    );

    if (!checkoutUrl) {
      return NextResponse.json(
        { error: 'Erro ao criar sessão de checkout' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error('[Checkout] Error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
