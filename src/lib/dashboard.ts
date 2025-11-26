import {
  addMonths,
  differenceInCalendarMonths,
  endOfDay,
  endOfMonth,
  format,
  startOfDay,
  startOfMonth,
} from "date-fns";
import { ptBR } from "date-fns/locale";

import { prisma } from "@/lib/prisma";

function decimalToNumber(value: unknown) {
  if (value === null || value === undefined) {
    return 0;
  }

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    return Number(value);
  }

  if (typeof value === "object" && value !== null && "toNumber" in value) {
    try {
      return Number((value as { toNumber(): number }).toNumber());
    } catch (error) {
      console.error("Erro ao converter decimal", error);
    }
  }

  return Number(value) || 0;
}

type FlightForTimeline = {
  flightDate: Date;
  durationHours: unknown;
  totalCost: unknown;
};

type ExpenseForTimeline = {
  expenseDate: Date;
  amount: unknown;
};

type MonthlyTimelineEntry = {
  key: string;
  label: string;
  monthDate: Date;
  flightCount: number;
  flightHours: number;
  flightCost: number;
  expenses: number;
};

function buildMonthlyTimeline({
  flights,
  expenses,
  startDate,
  endDate,
}: {
  flights: FlightForTimeline[];
  expenses: ExpenseForTimeline[];
  startDate: Date;
  endDate: Date;
}): MonthlyTimelineEntry[] {
  const startMonth = startOfMonth(startDate);
  const endMonth = startOfMonth(endDate);
  const totalMonths = differenceInCalendarMonths(endMonth, startMonth) + 1;
  const timeline = new Map<string, MonthlyTimelineEntry>();

  for (let index = 0; index < totalMonths; index += 1) {
    const monthDate = addMonths(startMonth, index);
    const key = format(monthDate, "yyyy-MM");
    timeline.set(key, {
      key,
      label: format(monthDate, "MMM yyyy", { locale: ptBR }),
      monthDate,
      flightCount: 0,
      flightHours: 0,
      flightCost: 0,
      expenses: 0,
    });
  }

  flights.forEach((flight) => {
    const monthDate = startOfMonth(flight.flightDate);
    const key = format(monthDate, "yyyy-MM");
    const entry = timeline.get(key);
    if (!entry) return;

    entry.flightCount += 1;
    entry.flightHours += decimalToNumber(flight.durationHours);
    entry.flightCost += decimalToNumber(flight.totalCost);
  });

  expenses.forEach((expense) => {
    const monthDate = startOfMonth(expense.expenseDate);
    const key = format(monthDate, "yyyy-MM");
    const entry = timeline.get(key);
    if (!entry) return;

    entry.expenses += decimalToNumber(expense.amount);
  });

  return Array.from(timeline.values()).sort(
    (a, b) => a.monthDate.getTime() - b.monthDate.getTime(),
  );
}

export async function getDashboardData(params?: { 
  startDate?: Date; 
  endDate?: Date;
  organizationId?: string | null;
}) {
  const now = new Date();
  const defaultStart = startOfMonth(now);
  const defaultEnd = endOfDay(now);

  const startDate = params?.startDate ?? defaultStart;
  const endDate = params?.endDate ?? defaultEnd;
  const organizationId = params?.organizationId;

  // Filtro base por organização
  const orgFilter = organizationId ? { organizationId } : {};

  const aircraftsPromise = prisma.aircraft.findMany({
    where: orgFilter,
    select: {
      id: true,
      tailNumber: true,
      model: true,
      status: true,
      totalHours: true,
    },
    orderBy: {
      tailNumber: "asc",
    },
  });

  // Se tiver organização, busca membros da organização
  // Senão, busca usuários globalmente (compatibilidade)
  const ownersPromise = organizationId 
    ? prisma.organizationMember.findMany({
        where: { 
          organizationId,
          status: "ACTIVE",
        },
        select: {
          id: true,
          role: true,
          ownershipPct: true,
          user: {
            select: {
              id: true,
              name: true,
            }
          }
        },
        orderBy: {
          user: { name: "asc" }
        },
      }).then(members => members.map(m => ({
        id: m.user.id,
        name: m.user.name,
        role: m.role,
        ownershipPct: m.ownershipPct,
      })))
    : prisma.user.findMany({
        select: {
          id: true,
          name: true,
          role: true,
          ownershipPct: true,
        },
        where: {
          role: {
            in: ["ADMIN", "CONTROLLER", "VIEWER"],
          },
          status: "ACTIVE",
        },
        orderBy: {
          name: "asc",
        },
      });

  const [aircrafts, owners] = await Promise.all([aircraftsPromise, ownersPromise]);

  const flightsWithinPeriod = await prisma.flight.findMany({
    where: {
      ...orgFilter,
      flightDate: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      flightDate: "desc",
    },
    include: {
      pilot: {
        select: {
          name: true,
        },
      },
      payer: {
        select: {
          name: true,
        },
      },
      aircraft: {
        select: {
          tailNumber: true,
          model: true,
        },
      },
    },
  });

  const expensesWithinPeriod = await prisma.expense.findMany({
    where: {
      ...orgFilter,
      expenseDate: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      expenseDate: "desc",
    },
    include: {
      paidBy: {
        select: {
          name: true,
        },
      },
      flight: {
        select: {
          origin: true,
          destination: true,
          flightDate: true,
        },
      },
    },
  });

  const upcomingFlights = await prisma.flight.findMany({
    where: {
      ...orgFilter,
      flightDate: {
        gte: startOfDay(now),
      },
    },
    orderBy: {
      flightDate: "asc",
    },
    take: 5,
    include: {
      pilot: {
        select: {
          name: true,
        },
      },
      aircraft: {
        select: {
          tailNumber: true,
          model: true,
        },
      },
    },
  });

  const totalAircraft = aircrafts.length;
  const availableAircraft = aircrafts.filter((aircraft: { status: string | null }) => aircraft.status === "AVAILABLE").length;
  const totalFleetHours = aircrafts.reduce(
    (sum: number, aircraft: { totalHours: unknown }) => sum + decimalToNumber(aircraft.totalHours),
    0,
  );

  const flightsInPeriod = flightsWithinPeriod.length;
  const hoursInPeriod = flightsWithinPeriod.reduce(
    (sum, flight) => sum + decimalToNumber(flight.durationHours),
    0,
  );
  const totalCostInPeriod = flightsWithinPeriod.reduce(
    (sum, flight) => sum + decimalToNumber(flight.totalCost),
    0,
  );
  const totalExpensesInPeriod = expensesWithinPeriod.reduce(
    (sum, expense) => sum + decimalToNumber(expense.amount),
    0,
  );
  const costPerHourInPeriod = hoursInPeriod > 0 ? totalCostInPeriod / hoursInPeriod : 0;

  const expensesByCategoryMap = new Map<string, number>();
  expensesWithinPeriod.forEach((expense) => {
    const current = expensesByCategoryMap.get(expense.category) ?? 0;
    expensesByCategoryMap.set(
      expense.category,
      current + decimalToNumber(expense.amount),
    );
  });

  const expensesByCategory = Array.from(expensesByCategoryMap.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const monthlyTimeline = buildMonthlyTimeline({
    flights: flightsWithinPeriod.map((flight) => ({
      flightDate: flight.flightDate,
      durationHours: flight.durationHours,
      totalCost: flight.totalCost,
    })),
    expenses: expensesWithinPeriod.map((expense) => ({
      expenseDate: expense.expenseDate,
      amount: expense.amount,
    })),
    startDate,
    endDate,
  });

  const recentFlights = flightsWithinPeriod.slice(0, 5);
  const recentExpenses = expensesWithinPeriod.slice(0, 5).map((expense) => ({
    ...expense,
    amount: decimalToNumber(expense.amount),
  }));

  // Calcular divisão de custos proporcional por owner
  const totalSharedAmount = totalCostInPeriod + totalExpensesInPeriod;
  const totalOwnershipPct = owners.reduce(
    (sum: number, owner: { ownershipPct: unknown }) => sum + decimalToNumber(owner.ownershipPct),
    0
  );

  const ownersWithShare = owners.map((owner: { id: string; name: string; role: string; ownershipPct: unknown }) => {
    const ownerPct = decimalToNumber(owner.ownershipPct);
    // Se nenhum owner tem percentual definido, divide igualmente
    const percentage = totalOwnershipPct > 0 
      ? ownerPct 
      : (100 / owners.length);
    const shareAmount = totalSharedAmount * (percentage / 100);
    
    return {
      ...owner,
      ownershipPct: percentage,
      shareAmount,
    };
  });

  return {
    summary: {
      totalAircraft,
      availableAircraft,
      totalFleetHours,
      flightsInPeriod,
      hoursInPeriod,
      totalCostInPeriod,
      totalExpensesInPeriod,
      costPerHourInPeriod,
    },
    period: {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    },
    monthlyTimeline,
    aircrafts,
    upcomingFlights,
    recentFlights,
    recentExpenses,
    expensesByCategory,
    owners: ownersWithShare,
  };
}
