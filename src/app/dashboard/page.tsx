import Image from "next/image";
import {
  differenceInCalendarMonths,
  endOfDay,
  endOfMonth,
  format,
  isValid,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfYear,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowUpRight, PlaneTakeoff, Receipt, Timer } from "lucide-react";

import { EditorPanel } from "@/components/editor/editor-panel";
import {
  DashboardPeriodSelector,
  type PeriodKey,
} from "@/components/dashboard/period-selector";
import { MonthlyTimeline } from "@/components/dashboard/monthly-timeline";
import { OwnerSharePanel } from "@/components/dashboard/owner-share-panel";
import { LogoutButton } from "@/components/logout-button";
import { requireCurrentUser } from "@/lib/auth";
import { getDashboardData } from "@/lib/dashboard";
import { formatCurrency } from "@/lib/utils";

type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;
type UpcomingFlight = DashboardData["upcomingFlights"][number];
type RecentFlight = DashboardData["recentFlights"][number];
type RecentExpense = DashboardData["recentExpenses"][number];
type ExpenseCategory = DashboardData["expensesByCategory"][number];

function formatDate(value: Date | string | null | undefined) {
  if (!value) return "-";

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return format(date, "dd MMM yyyy HH:mm", { locale: ptBR });
}

const ROLE_LABELS = {
  ADMIN: "Administrador / Comandante",
  CONTROLLER: "Administrador / Comandante",
  VIEWER: "Proprietário / Passageiro",
  PILOT: "Copiloto",
  CTM: "CTM",
} as const;

const PERIOD_DEFAULT: PeriodKey = "current-month";

function isPeriodKey(value: string): value is PeriodKey {
  return ["current-month", "last-3-months", "last-6-months", "year-to-date", "custom"].includes(
    value,
  );
}

function resolvePeriod(searchParams: Record<string, string | string[] | undefined>) {
  const now = new Date();
  const defaultStart = startOfMonth(now);
  const defaultEnd = endOfDay(now);

  const rawPeriod = typeof searchParams.period === "string" ? searchParams.period : PERIOD_DEFAULT;
  const period = isPeriodKey(rawPeriod) ? rawPeriod : PERIOD_DEFAULT;

  let startDate = defaultStart;
  let endDate = defaultEnd;

  switch (period) {
    case "last-3-months":
      startDate = startOfMonth(subMonths(now, 2));
      break;
    case "last-6-months":
      startDate = startOfMonth(subMonths(now, 5));
      break;
    case "year-to-date":
      startDate = startOfYear(now);
      break;
    case "custom": {
      const startParam =
        typeof searchParams.start === "string" ? parseISO(searchParams.start) : null;
      const endParam = typeof searchParams.end === "string" ? parseISO(searchParams.end) : null;

      if (startParam && isValid(startParam)) {
        startDate = startOfDay(startParam);
      }
      if (endParam && isValid(endParam)) {
        endDate = endOfDay(endParam);
      }

      if (startDate > endDate) {
        const temp = startDate;
        startDate = endDate;
        endDate = temp;
      }

      break;
    }
    default:
      break;
  }

  return { period, startDate, endDate };
}

export default async function DashboardPage({
  searchParams = {},
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const { period, startDate, endDate } = resolvePeriod(searchParams);
  const user = await requireCurrentUser();
  const data = await getDashboardData({ startDate, endDate });
  const canManage = user.role === "ADMIN" || user.role === "CONTROLLER";
  const {
    summary,
    upcomingFlights,
    recentFlights,
    recentExpenses,
    expensesByCategory,
    monthlyTimeline,
    owners,
  } = data;

  const {
    totalAircraft,
    availableAircraft,
    totalFleetHours,
    flightsInPeriod,
    hoursInPeriod,
    totalCostInPeriod,
    totalExpensesInPeriod,
    costPerHourInPeriod,
  } = summary;

  const periodRangeLabel = `${format(startDate, "dd MMM yyyy", { locale: ptBR })} – ${format(
    endDate,
    "dd MMM yyyy",
    { locale: ptBR },
  )}`;
  const monthsInRange =
    differenceInCalendarMonths(endOfMonth(endDate), startOfMonth(startDate)) + 1;
  const periodStartInput = format(startDate, "yyyy-MM-dd");
  const periodEndInput = format(endDate, "yyyy-MM-dd");

  const summaryItems = [
    {
      label: "Aeronaves ativas",
      value: `${availableAircraft}/${totalAircraft}`,
      description: "Disponíveis hoje",
      icon: PlaneTakeoff,
    },
    {
      label: "Horas totais da frota",
      value: `${totalFleetHours.toFixed(1)}h`,
      description: "Acumulado geral",
      icon: Timer,
    },
    {
      label: "Voos no período",
      value: `${flightsInPeriod} voos`,
      description: `${hoursInPeriod.toFixed(1)}h registradas`,
      icon: ArrowUpRight,
    },
    {
      label: "Custo operacional",
      value: formatCurrency(totalCostInPeriod || 0),
      description: `Média/hora: ${formatCurrency(costPerHourInPeriod || 0)} · Despesas: ${formatCurrency(
        totalExpensesInPeriod || 0,
      )}`,
      icon: Receipt,
    },
  ];

  const totalSharedAmount = totalCostInPeriod + totalExpensesInPeriod;

  return (
    <main className="min-h-screen bg-gradient-to-br from-air-blue-900 via-air-blue-700 to-air-blue-500 pb-20">
      <div className="container mx-auto px-4 py-12 text-white">
        <header className="mb-10">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="relative h-12 w-12">
                  <Image
                    src="/airx-logo.svg"
                    alt="Logotipo Air X Control"
                    fill
                    sizes="3rem"
                    priority
                  />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-lg font-semibold text-white">Air X</span>
                  <span className="text-xs uppercase tracking-[0.35em] text-air-blue-200">
                    Control
                  </span>
                </div>
              </div>
              <h1 className="text-4xl font-bold">Painel Operacional</h1>
              <p className="mt-3 max-w-2xl text-air-blue-100">
                Visão consolidada para compartilhar com os coproprietários o desempenho do período
                selecionado, próximos voos e o impacto financeiro de cada aeronave.
              </p>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur">
              <div>
                <p className="text-xs uppercase tracking-wide text-air-blue-200">Usuário ativo</p>
                <p className="text-lg font-semibold text-white">{user.name}</p>
                <p className="text-xs text-air-blue-200">
                  {ROLE_LABELS[user.role as keyof typeof ROLE_LABELS] ?? "Colaborador"}
                </p>
              </div>
              <LogoutButton />
            </div>
          </div>
        </header>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-air-blue-100">
            <p>
              Período analisado:
              {" "}
              <span className="font-semibold text-white">{periodRangeLabel}</span>
            </p>
            <p>
              Divisão mensal:
              {" "}
              {monthsInRange}
              {" "}
              {monthsInRange === 1 ? "mês" : "meses"}
            </p>
          </div>
          <DashboardPeriodSelector
            period={period}
            startDate={periodStartInput}
            endDate={periodEndInput}
          />
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryItems.map((item) => (
            <div
              key={item.label}
              className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium uppercase tracking-wide text-air-blue-200">
                  {item.label}
                </span>
                <item.icon className="h-5 w-5 text-air-gold-400" />
              </div>
              <strong className="text-2xl font-semibold">{item.value}</strong>
              <span className="text-sm text-air-blue-200">{item.description}</span>
            </div>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Divisão mensal do período</h2>
              <p className="text-sm text-air-blue-200">
                Compare voos, horas acumuladas e despesas mês a mês para acelerar as prestações de
                contas.
              </p>
            </div>
          </div>
          <MonthlyTimeline timeline={monthlyTimeline} />
        </section>

        <section className="mt-12">
          <OwnerSharePanel
            owners={owners}
            totalAmount={totalSharedAmount}
            periodLabel={periodRangeLabel}
          />
        </section>

        <section className="mt-12 grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">Próximos voos</h2>
                  <p className="text-sm text-air-blue-200">
                    Agenda das próximas missões com foco em pontualidade e alocação de recursos.
                  </p>
                </div>
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="text-air-blue-200">
                    <tr>
                      <th className="pb-3 pr-4">Data</th>
                      <th className="pb-3 pr-4">Rota</th>
                      <th className="pb-3 pr-4">Piloto</th>
                      <th className="pb-3 pr-4">Aeronave</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {upcomingFlights.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="py-6 text-center text-air-blue-200"
                        >
                          Nenhum voo agendado para hoje em diante.
                        </td>
                      </tr>
                    ) : (
                      upcomingFlights.map((flight: UpcomingFlight) => (
                        <tr key={flight.id} className="text-white">
                          <td className="py-3 pr-4">{formatDate(flight.flightDate)}</td>
                          <td className="py-3 pr-4">
                            {flight.origin} → {flight.destination}
                          </td>
                          <td className="py-3 pr-4">{flight.pilot?.name ?? "—"}</td>
                          <td className="py-3 pr-4">
                            {flight.aircraft?.tailNumber ?? "—"}
                            <span className="ml-2 text-xs text-air-blue-200">
                              {flight.aircraft?.model ?? ""}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
              <h2 className="text-xl font-semibold">Top gastos no período</h2>
              <p className="text-sm text-air-blue-200">
                Categorias com maior impacto financeiro considerando o filtro atual.
              </p>
              <ul className="mt-5 space-y-3">
                {expensesByCategory.length === 0 ? (
                  <li className="text-air-blue-200">Nenhuma despesa registrada no período.</li>
                ) : (
                  expensesByCategory.map((item: ExpenseCategory) => (
                    <li key={item.category} className="flex items-center justify-between text-sm">
                      <span>{item.category}</span>
                      <strong>{formatCurrency(item.total)}</strong>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
              <h2 className="text-xl font-semibold">Resumo financeiro do período</h2>
              <dl className="mt-4 space-y-2 text-sm text-air-blue-200">
                <div className="flex items-center justify-between text-white">
                  <dt>Total de despesas</dt>
                  <dd>{formatCurrency(totalExpensesInPeriod)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Custo operacional de voos</dt>
                  <dd>{formatCurrency(totalCostInPeriod)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Custo médio por hora</dt>
                  <dd>{formatCurrency(costPerHourInPeriod)}</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
            <h2 className="text-2xl font-semibold">Voos concluídos recentemente</h2>
            <p className="text-sm text-air-blue-200">
              Destaque das últimas operações realizadas com notas sobre ocupação e custos.
            </p>
            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-air-blue-200">
                  <tr>
                    <th className="pb-3 pr-4">Data</th>
                    <th className="pb-3 pr-4">Rota</th>
                    <th className="pb-3 pr-4">Piloto</th>
                    <th className="pb-3 pr-4">Responsável</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {recentFlights.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-air-blue-200">
                        Ainda sem histórico registrado.
                      </td>
                    </tr>
                  ) : (
                    recentFlights.map((flight: RecentFlight) => (
                      <tr key={flight.id} className="text-white">
                        <td className="py-3 pr-4">{formatDate(flight.flightDate)}</td>
                        <td className="py-3 pr-4">
                          {flight.origin} → {flight.destination}
                        </td>
                        <td className="py-3 pr-4">{flight.pilot?.name ?? "—"}</td>
                        <td className="py-3 pr-4">{flight.payer?.name ?? "—"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
            <h2 className="text-2xl font-semibold">Despesas recentes</h2>
            <p className="text-sm text-air-blue-200">
              Compras e serviços que impactaram o caixa nos últimos lançamentos.
            </p>
            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-air-blue-200">
                  <tr>
                    <th className="pb-3 pr-4">Data</th>
                    <th className="pb-3 pr-4">Categoria</th>
                    <th className="pb-3 pr-4">Valor</th>
                    <th className="pb-3 pr-4">Responsável</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {recentExpenses.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-air-blue-200">
                        Nenhuma despesa registrada.
                      </td>
                    </tr>
                  ) : (
                    recentExpenses.map((expense: RecentExpense) => (
                      <tr key={expense.id} className="text-white">
                        <td className="py-3 pr-4">{formatDate(expense.expenseDate)}</td>
                        <td className="py-3 pr-4">{expense.category}</td>
                        <td className="py-3 pr-4">{formatCurrency(expense.amount)}</td>
                        <td className="py-3 pr-4">{expense.paidBy?.name ?? "—"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <EditorPanel canManage={canManage} />
        </section>
      </div>
    </main>
  );
}
