import Stripe from 'stripe';

// Cliente do Stripe para uso no servidor
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

// Planos disponíveis
export const PLANS = {
  FREE: {
    name: 'Essencial',
    description: 'Para começar',
    price: 0,
    priceId: null,
    features: [
      '1 aeronave',
      '2 usuários',
      'Dashboard básico',
    ],
    limits: {
      aircraft: 1,
      users: 2,
      flightsPerMonth: -1,
    },
  },
  PRO: {
    name: 'Profissional',
    description: 'Para copropriedades',
    price: 397,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      '3 aeronaves incluídas',
      'Usuários ilimitados',
      'Dashboard completo',
      'Relatórios em PDF',
      'Suporte por email',
    ],
    limits: {
      aircraft: 3,
      users: -1,
      flightsPerMonth: -1,
    },
  },
  ENTERPRISE: {
    name: 'Enterprise',
    description: 'Operação completa',
    price: 697,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    features: [
      'Aeronaves ilimitadas',
      'Usuários ilimitados',
      'Módulo de Manutenção',
      'API dedicada',
      'Suporte dedicado',
      'SLA garantido',
    ],
    limits: {
      aircraft: -1,
      users: -1,
      flightsPerMonth: -1,
    },
  },
} as const;

export type PlanType = keyof typeof PLANS;

/**
 * Cria ou recupera um customer no Stripe
 */
export async function getOrCreateStripeCustomer(
  email: string,
  name: string,
  organizationId: string
): Promise<string | null> {
  if (!stripe) {
    console.warn('[Stripe] API key not configured');
    return null;
  }

  try {
    // Busca customer existente pelo email
    const customers = await stripe.customers.list({
      email,
      limit: 1,
    });

    if (customers.data.length > 0) {
      return customers.data[0].id;
    }

    // Cria novo customer
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        organizationId,
      },
    });

    return customer.id;
  } catch (error) {
    console.error('[Stripe] Error creating customer:', error);
    return null;
  }
}

/**
 * Cria uma sessão de checkout para upgrade de plano
 */
export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  organizationId: string,
  successUrl: string,
  cancelUrl: string
): Promise<string | null> {
  if (!stripe) {
    console.warn('[Stripe] API key not configured');
    return null;
  }

  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        organizationId,
      },
      subscription_data: {
        metadata: {
          organizationId,
        },
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    });

    return session.url;
  } catch (error) {
    console.error('[Stripe] Error creating checkout session:', error);
    return null;
  }
}

/**
 * Cria um portal de billing para gerenciar assinatura
 */
export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string
): Promise<string | null> {
  if (!stripe) {
    console.warn('[Stripe] API key not configured');
    return null;
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return session.url;
  } catch (error) {
    console.error('[Stripe] Error creating portal session:', error);
    return null;
  }
}

/**
 * Cancela uma assinatura
 */
export async function cancelSubscription(
  subscriptionId: string,
  immediately = false
): Promise<boolean> {
  if (!stripe) {
    console.warn('[Stripe] API key not configured');
    return false;
  }

  try {
    if (immediately) {
      await stripe.subscriptions.cancel(subscriptionId);
    } else {
      await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
    }
    return true;
  } catch (error) {
    console.error('[Stripe] Error canceling subscription:', error);
    return false;
  }
}

/**
 * Obtém detalhes de uma subscription
 */
export async function getSubscription(subscriptionId: string) {
  if (!stripe) return null;

  try {
    return await stripe.subscriptions.retrieve(subscriptionId);
  } catch (error) {
    console.error('[Stripe] Error getting subscription:', error);
    return null;
  }
}

/**
 * Verifica se a organização pode usar um recurso baseado no plano
 */
export function canUsePlanFeature(
  plan: string,
  feature: 'aircraft' | 'users' | 'flightsPerMonth',
  currentCount: number
): boolean {
  const planConfig = PLANS[plan as PlanType] || PLANS.FREE;
  const limit = planConfig.limits[feature];
  
  // -1 significa ilimitado
  if (limit === -1) return true;
  
  return currentCount < limit;
}

/**
 * Obtém o limite de um recurso para o plano
 */
export function getPlanLimit(
  plan: string,
  feature: 'aircraft' | 'users' | 'flightsPerMonth'
): number {
  const planConfig = PLANS[plan as PlanType] || PLANS.FREE;
  return planConfig.limits[feature];
}
// stripe env reload
