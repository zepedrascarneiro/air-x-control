import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createBillingPortalSession } from '@/lib/stripe';

/**
 * POST /api/stripe/portal
 * Cria uma sessão do portal de billing do Stripe
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
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

    if (!organization.stripeCustomerId) {
      return NextResponse.json(
        { error: 'Nenhuma assinatura ativa' },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const portalUrl = await createBillingPortalSession(
      organization.stripeCustomerId,
      `${appUrl}/settings`
    );

    if (!portalUrl) {
      return NextResponse.json(
        { error: 'Erro ao criar portal de billing' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: portalUrl });
  } catch (error) {
    console.error('[Portal] Error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
