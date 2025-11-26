import { NextRequest, NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cancelSubscription } from "@/lib/stripe";

export const dynamic = "force-dynamic";

// Motivos de cancelamento pré-definidos
const CANCELLATION_REASONS = [
  "too_expensive",
  "missing_features",
  "switched_competitor",
  "not_using_enough",
  "technical_issues",
  "temporary_pause",
  "other",
] as const;

type CancellationReason = (typeof CANCELLATION_REASONS)[number];

interface CancelRequest {
  reason: CancellationReason;
  feedback?: string;
  cancelImmediately?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireCurrentUser();
    
    // Buscar organização do usuário
    const membership = await prisma.organizationMember.findFirst({
      where: { userId: user.id },
      include: { 
        organization: true 
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "Organização não encontrada" },
        { status: 404 }
      );
    }

    // Apenas OWNER pode cancelar
    if (membership.role !== "OWNER") {
      return NextResponse.json(
        { error: "Apenas o proprietário pode cancelar a assinatura" },
        { status: 403 }
      );
    }

    const org = membership.organization;

    // Verificar se tem assinatura ativa
    // Cast para acessar campos que podem não estar no cache de tipos do Prisma
    type OrgWithSubscription = typeof org & {
      stripeSubscriptionId?: string | null;
      subscriptionStatus?: string | null;
    };
    const orgTyped = org as OrgWithSubscription;
    const subscriptionId = orgTyped.stripeSubscriptionId;
    const subscriptionStatus = orgTyped.subscriptionStatus;

    if (!subscriptionId) {
      return NextResponse.json(
        { error: "Nenhuma assinatura ativa encontrada" },
        { status: 400 }
      );
    }

    if (subscriptionStatus === "canceled") {
      return NextResponse.json(
        { error: "A assinatura já foi cancelada" },
        { status: 400 }
      );
    }

    // Parse do body
    const body: CancelRequest = await request.json();
    
    if (!body.reason || !CANCELLATION_REASONS.includes(body.reason)) {
      return NextResponse.json(
        { error: "Motivo de cancelamento inválido" },
        { status: 400 }
      );
    }

    // Cancelar no Stripe
    const success = await cancelSubscription(
      subscriptionId,
      body.cancelImmediately || false
    );

    if (!success) {
      return NextResponse.json(
        { error: "Erro ao cancelar assinatura no Stripe" },
        { status: 500 }
      );
    }

    // Salvar feedback de cancelamento
    // Usando raw query para evitar problemas de cache do Prisma
    await prisma.$executeRaw`
      UPDATE Organization 
      SET 
        subscriptionStatus = ${body.cancelImmediately ? "canceled" : "canceling"},
        updatedAt = ${new Date().toISOString()}
      WHERE id = ${org.id}
    `;

    // Salvar o motivo do cancelamento em uma tabela de feedback (criar se não existir)
    // Por enquanto, vamos logar para análise
    console.log("[Cancellation Feedback]", {
      organizationId: org.id,
      organizationName: org.name,
      reason: body.reason,
      feedback: body.feedback,
      canceledImmediately: body.cancelImmediately,
      previousPlan: org.plan,
      canceledAt: new Date().toISOString(),
    });

    // Retornar sucesso
    return NextResponse.json({
      success: true,
      message: body.cancelImmediately
        ? "Assinatura cancelada imediatamente. Seu plano foi alterado para FREE."
        : "Assinatura será cancelada ao fim do período atual. Você pode continuar usando até lá.",
      canceledImmediately: body.cancelImmediately,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Usuário não autenticado") {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    console.error("[Cancel Subscription] Error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// GET para verificar status de cancelamento
export async function GET() {
  try {
    const user = await requireCurrentUser();
    
    const membership = await prisma.organizationMember.findFirst({
      where: { userId: user.id },
      include: { organization: true },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "Organização não encontrada" },
        { status: 404 }
      );
    }

    // Cast para acessar campos de subscription
    type OrgWithSubscription = typeof membership.organization & {
      stripeSubscriptionId?: string | null;
      subscriptionStatus?: string | null;
      subscriptionPeriodEnd?: Date | null;
    };
    const org = membership.organization as OrgWithSubscription;

    return NextResponse.json({
      hasSubscription: !!org.stripeSubscriptionId,
      subscriptionStatus: org.subscriptionStatus || null,
      subscriptionPeriodEnd: org.subscriptionPeriodEnd || null,
      plan: org.plan,
      canCancel: membership.role === "OWNER" && 
                 !!org.stripeSubscriptionId && 
                 org.subscriptionStatus !== "canceled",
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Usuário não autenticado") {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    console.error("[Cancel Status] Error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
