import { prisma } from './prisma';
import { PLANS, PlanType } from './stripe';

export type LimitType = 'aircraft' | 'users' | 'flightsPerMonth';

export interface PlanLimitResult {
  allowed: boolean;
  currentCount: number;
  limit: number;
  plan: string;
  planName: string;
  message?: string;
  upgradeRequired?: boolean;
}

/**
 * Verifica se uma organização pode adicionar mais de um recurso
 */
export async function checkPlanLimit(
  organizationId: string,
  limitType: LimitType
): Promise<PlanLimitResult> {
  // Busca a organização com contagens
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    include: {
      _count: {
        select: {
          aircraft: true,
          members: true,
          flights: true,
        },
      },
    },
  });

  if (!org) {
    return {
      allowed: false,
      currentCount: 0,
      limit: 0,
      plan: 'FREE',
      planName: 'Essencial',
      message: 'Organização não encontrada',
    };
  }

  const plan = (org.plan as PlanType) || 'FREE';
  const planConfig = PLANS[plan] || PLANS.FREE;
  const limit = planConfig.limits[limitType];
  
  // Determina a contagem atual baseada no tipo
  let currentCount = 0;
  switch (limitType) {
    case 'aircraft':
      currentCount = org._count.aircraft;
      break;
    case 'users':
      currentCount = org._count.members;
      break;
    case 'flightsPerMonth':
      // Para voos, conta apenas do mês atual
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      currentCount = await prisma.flight.count({
        where: {
          organizationId,
          flightDate: { gte: startOfMonth },
        },
      });
      break;
  }

  // -1 significa ilimitado
  const allowed = limit === -1 || currentCount < limit;

  // Mensagens específicas por tipo
  const messages: Record<LimitType, string> = {
    aircraft: `Seu plano ${planConfig.name} permite até ${limit === -1 ? 'ilimitadas' : limit} aeronave(s). Você já tem ${currentCount}.`,
    users: `Seu plano ${planConfig.name} permite até ${limit === -1 ? 'ilimitados' : limit} membro(s). Você já tem ${currentCount}.`,
    flightsPerMonth: `Seu plano ${planConfig.name} permite até ${limit === -1 ? 'ilimitados' : limit} voo(s) por mês. Você já tem ${currentCount}.`,
  };

  return {
    allowed,
    currentCount,
    limit,
    plan,
    planName: planConfig.name,
    message: allowed ? undefined : messages[limitType],
    upgradeRequired: !allowed,
  };
}

/**
 * Obtém todos os limites de uma organização
 */
export async function getOrganizationLimits(organizationId: string) {
  const [aircraft, users] = await Promise.all([
    checkPlanLimit(organizationId, 'aircraft'),
    checkPlanLimit(organizationId, 'users'),
  ]);

  return { aircraft, users };
}

/**
 * Verifica se organização está em trial
 */
export async function checkTrialStatus(organizationId: string) {
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: {
      plan: true,
      trialEndsAt: true,
      subscriptionStatus: true,
    },
  });

  if (!org) return null;

  const now = new Date();
  const isInTrial = org.trialEndsAt && org.trialEndsAt > now;
  const trialDaysRemaining = org.trialEndsAt
    ? Math.ceil((org.trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return {
    isInTrial,
    trialEndsAt: org.trialEndsAt,
    trialDaysRemaining: Math.max(0, trialDaysRemaining),
    plan: org.plan,
    subscriptionStatus: org.subscriptionStatus,
  };
}

/**
 * Inicia trial PRO para uma organização
 */
export async function startTrial(organizationId: string, days = 7) {
  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + days);

  await prisma.organization.update({
    where: { id: organizationId },
    data: {
      plan: 'PRO',
      trialEndsAt,
      subscriptionStatus: 'trialing',
    },
  });

  return { trialEndsAt, days };
}

/**
 * Expira trials vencidos (para ser chamado por cron job)
 */
export async function expireTrials() {
  const now = new Date();

  const expiredOrgs = await prisma.organization.updateMany({
    where: {
      trialEndsAt: { lt: now },
      subscriptionStatus: 'trialing',
    },
    data: {
      plan: 'FREE',
      trialEndsAt: null,
      subscriptionStatus: null,
    },
  });

  return expiredOrgs.count;
}

/**
 * Calcula uso percentual de um limite
 */
export function calculateUsagePercentage(current: number, limit: number): number {
  if (limit === -1) return 0; // Ilimitado
  if (limit === 0) return 100;
  return Math.min(100, Math.round((current / limit) * 100));
}

/**
 * Retorna o próximo plano recomendado para upgrade
 */
export function getUpgradePlan(currentPlan: string): PlanType | null {
  switch (currentPlan) {
    case 'FREE':
      return 'PRO';
    case 'PRO':
      return 'ENTERPRISE';
    default:
      return null;
  }
}
