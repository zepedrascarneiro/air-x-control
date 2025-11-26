import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PLANS, PlanType } from "@/lib/stripe";

export const dynamic = "force-dynamic";

interface PlanDistribution {
  plan: string;
  count: number;
  percentage: number;
}

interface RevenueData {
  month: string;
  mrr: number;
  newCustomers: number;
  churned: number;
}

interface OrganizationData {
  id: string;
  name: string;
  plan: string;
  status: string;
  subscriptionStatus: string | null;
  trialEndsAt: Date | null;
  createdAt: Date;
  _count: {
    members: number;
    aircraft: number;
    flights: number;
    expenses: number;
  };
}

interface SaaSMetrics {
  // Core Metrics
  totalOrganizations: number;
  activeSubscriptions: number;
  trialsActive: number;
  mrr: number; // Monthly Recurring Revenue
  arr: number; // Annual Recurring Revenue
  
  // Growth Metrics
  newOrgsThisMonth: number;
  newOrgsLastMonth: number;
  growthRate: number;
  
  // Plan Distribution
  planDistribution: PlanDistribution[];
  
  // Subscription Status
  subscriptionStatus: {
    active: number;
    trialing: number;
    past_due: number;
    canceled: number;
    none: number;
  };
  
  // Trial Metrics
  trialMetrics: {
    active: number;
    expiringSoon: number; // Próximos 3 dias
    convertedThisMonth: number;
  };
  
  // Revenue History (últimos 6 meses)
  revenueHistory: RevenueData[];
  
  // Recent Organizations
  recentOrganizations: {
    id: string;
    name: string;
    plan: string;
    status: string;
    subscriptionStatus: string | null;
    memberCount: number;
    aircraftCount: number;
    createdAt: Date;
    trialEndsAt: Date | null;
  }[];
}

function calculateMRR(organizations: { plan: string; subscriptionStatus: string | null }[]): number {
  let mrr = 0;
  
  for (const org of organizations) {
    if (org.subscriptionStatus === "active" || org.subscriptionStatus === "trialing") {
      const planKey = org.plan as PlanType;
      const planConfig = PLANS[planKey] || PLANS.FREE;
      if (typeof planConfig.price === "number") {
        mrr += planConfig.price;
      }
    }
  }
  
  return mrr;
}

export async function GET() {
  try {
    const currentUser = await requireCurrentUser();

    // Apenas ADMIN pode acessar
    if (currentUser.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Acesso negado. Apenas administradores podem acessar." },
        { status: 403 }
      );
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    // Buscar todas as organizações - cast para bypass do cache de tipos do Prisma
    const rawOrganizations = await prisma.$queryRaw`
      SELECT 
        o.id,
        o.name,
        o.plan,
        o.status,
        o.subscriptionStatus,
        o.trialEndsAt,
        o.createdAt,
        (SELECT COUNT(*) FROM OrganizationMember WHERE organizationId = o.id) as memberCount,
        (SELECT COUNT(*) FROM Aircraft WHERE organizationId = o.id) as aircraftCount,
        (SELECT COUNT(*) FROM Flight WHERE organizationId = o.id) as flightCount,
        (SELECT COUNT(*) FROM Expense WHERE organizationId = o.id) as expenseCount
      FROM Organization o
      ORDER BY o.createdAt DESC
    ` as {
      id: string;
      name: string;
      plan: string;
      status: string;
      subscriptionStatus: string | null;
      trialEndsAt: string | null;
      createdAt: string;
      memberCount: bigint;
      aircraftCount: bigint;
      flightCount: bigint;
      expenseCount: bigint;
    }[];
    
    // Converter para o formato esperado
    const organizations: OrganizationData[] = rawOrganizations.map(o => ({
      id: o.id,
      name: o.name,
      plan: o.plan,
      status: o.status,
      subscriptionStatus: o.subscriptionStatus,
      trialEndsAt: o.trialEndsAt ? new Date(o.trialEndsAt) : null,
      createdAt: new Date(o.createdAt),
      _count: {
        members: Number(o.memberCount),
        aircraft: Number(o.aircraftCount),
        flights: Number(o.flightCount),
        expenses: Number(o.expenseCount),
      },
    }));

    // Core Metrics
    const totalOrganizations = organizations.length;
    const activeSubscriptions = organizations.filter(
      (o) => o.subscriptionStatus === "active"
    ).length;
    const trialsActive = organizations.filter(
      (o) => o.subscriptionStatus === "trialing" || 
             (o.trialEndsAt && new Date(o.trialEndsAt) > now)
    ).length;

    // Calcular MRR
    const mrr = calculateMRR(organizations.map(o => ({
      plan: o.plan,
      subscriptionStatus: o.subscriptionStatus,
    })));
    const arr = mrr * 12;

    // Growth Metrics
    const newOrgsThisMonth = organizations.filter(
      (o) => new Date(o.createdAt) >= startOfMonth
    ).length;
    const newOrgsLastMonth = organizations.filter(
      (o) => new Date(o.createdAt) >= startOfLastMonth && 
             new Date(o.createdAt) < startOfMonth
    ).length;
    const growthRate = newOrgsLastMonth > 0 
      ? ((newOrgsThisMonth - newOrgsLastMonth) / newOrgsLastMonth) * 100 
      : newOrgsThisMonth > 0 ? 100 : 0;

    // Plan Distribution
    const planCounts: Record<string, number> = {
      FREE: 0,
      PRO: 0,
      ENTERPRISE: 0,
    };
    organizations.forEach((o) => {
      const plan = o.plan || "FREE";
      if (planCounts[plan] !== undefined) {
        planCounts[plan]++;
      } else {
        planCounts.FREE++;
      }
    });
    
    const planDistribution: PlanDistribution[] = Object.entries(planCounts).map(([plan, count]) => ({
      plan,
      count,
      percentage: totalOrganizations > 0 ? (count / totalOrganizations) * 100 : 0,
    }));

    // Subscription Status Distribution
    const statusCounts = {
      active: 0,
      trialing: 0,
      past_due: 0,
      canceled: 0,
      none: 0,
    };
    organizations.forEach((o) => {
      const status = o.subscriptionStatus || "none";
      if (status in statusCounts) {
        statusCounts[status as keyof typeof statusCounts]++;
      } else {
        statusCounts.none++;
      }
    });

    // Trial Metrics
    const trialOrgs = organizations.filter(
      (o) => o.trialEndsAt && new Date(o.trialEndsAt) > now
    );
    const trialsExpiringSoon = trialOrgs.filter(
      (o) => o.trialEndsAt && new Date(o.trialEndsAt) <= threeDaysFromNow
    ).length;
    
    // Conversões de trial este mês (orgs que tinham trial e agora têm subscription ativa)
    const convertedThisMonth = organizations.filter(
      (o) => o.subscriptionStatus === "active" && 
             o.trialEndsAt && 
             new Date(o.trialEndsAt) >= startOfMonth
    ).length;

    // Revenue History (simulado - em produção, buscar do Stripe)
    const revenueHistory: RevenueData[] = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = monthDate.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
      
      // Contar orgs criadas neste mês
      const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1);
      
      const orgsCreatedInMonth = organizations.filter(
        (o) => new Date(o.createdAt) >= monthStart && new Date(o.createdAt) < monthEnd
      ).length;
      
      // Estimar MRR baseado em orgs ativas até aquele mês
      const orgsUntilMonth = organizations.filter(
        (o) => new Date(o.createdAt) < monthEnd && 
               (o.subscriptionStatus === "active" || o.subscriptionStatus === "trialing")
      );
      const monthMrr = calculateMRR(orgsUntilMonth.map(o => ({
        plan: o.plan,
        subscriptionStatus: o.subscriptionStatus,
      })));
      
      revenueHistory.push({
        month: monthName,
        mrr: monthMrr,
        newCustomers: orgsCreatedInMonth,
        churned: 0, // Em produção, buscar do Stripe
      });
    }

    // Recent Organizations (top 10)
    const recentOrganizations = organizations.slice(0, 10).map((o) => ({
      id: o.id,
      name: o.name,
      plan: o.plan,
      status: o.status,
      subscriptionStatus: o.subscriptionStatus,
      memberCount: o._count.members,
      aircraftCount: o._count.aircraft,
      createdAt: o.createdAt,
      trialEndsAt: o.trialEndsAt,
    }));

    const metrics: SaaSMetrics = {
      totalOrganizations,
      activeSubscriptions,
      trialsActive,
      mrr,
      arr,
      newOrgsThisMonth,
      newOrgsLastMonth,
      growthRate,
      planDistribution,
      subscriptionStatus: statusCounts,
      trialMetrics: {
        active: trialsActive,
        expiringSoon: trialsExpiringSoon,
        convertedThisMonth,
      },
      revenueHistory,
      recentOrganizations,
    };

    return NextResponse.json(metrics);
  } catch (error) {
    if (error instanceof Error && error.message === "Usuário não autenticado") {
      return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
    }

    console.error("Erro ao buscar métricas SaaS:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
