import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

// Inicializa Stripe diretamente
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

// Preços dos planos
const PRICE_IDS: Record<string, string | undefined> = {
  PRO: process.env.STRIPE_PRO_PRICE_ID,
  ENTERPRISE: process.env.STRIPE_ENTERPRISE_PRICE_ID,
};

/**
 * POST /api/stripe/checkout
 * Cria uma sessão de checkout para upgrade de plano
 */
export async function POST(request: NextRequest) {
  try {
    // Verifica se Stripe está configurado
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe não configurado. Verifique STRIPE_SECRET_KEY.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { plan } = body as { plan: string };

    // ENTERPRISE não disponível até Junho 2026
    if (plan === 'ENTERPRISE') {
      return NextResponse.json(
        { error: 'O plano Enterprise estará disponível em Junho de 2026. Por enquanto, assine o plano Profissional!' },
        { status: 400 }
      );
    }

    // Valida o plano (apenas PRO disponível)
    if (!plan || plan !== 'PRO') {
      return NextResponse.json(
        { error: 'Plano inválido. Use PRO.' },
        { status: 400 }
      );
    }

    const priceId = PRICE_IDS[plan];
    if (!priceId) {
      return NextResponse.json(
        { error: `Price ID não configurado para ${plan}. Verifique STRIPE_${plan}_PRICE_ID.` },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://air-x-control-9tnmi.ondigitalocean.app';
    
    // Verifica se usuário está logado
    const user = await getCurrentUser();

    if (!user) {
      // Usuário não logado - checkout simples
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: 'subscription',
        success_url: `${appUrl}/register?success=true&plan=${plan}`,
        cancel_url: `${appUrl}/pricing?canceled=true`,
        allow_promotion_codes: true,
      });

      return NextResponse.json({ url: session.url });
    }

    // Usuário logado - busca organização
    const membership = await prisma.organizationMember.findFirst({
      where: { 
        userId: user.id,
        role: { in: ['OWNER', 'ADMIN'] },
      },
      include: { organization: true },
    });

    if (!membership) {
      return NextResponse.json(
        { error: 'Você precisa ser OWNER ou ADMIN para assinar.' },
        { status: 403 }
      );
    }

    const org = membership.organization;

    // Cria ou usa customer existente
    let customerId = org.stripeCustomerId;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: org.name,
        metadata: { organizationId: org.id },
      });
      customerId = customer.id;

      // Salva customer ID
      await prisma.organization.update({
        where: { id: org.id },
        data: { stripeCustomerId: customerId },
      });
    }

    // Cria sessão de checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${appUrl}/settings?success=true&plan=${plan}`,
      cancel_url: `${appUrl}/pricing?canceled=true`,
      allow_promotion_codes: true,
      metadata: { organizationId: org.id },
      subscription_data: { metadata: { organizationId: org.id } },
    });

    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error('[Checkout] Error:', error);
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json(
      { error: 'Erro ao criar checkout', details: message },
      { status: 500 }
    );
  }
}
