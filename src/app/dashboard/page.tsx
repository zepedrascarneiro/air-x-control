import Image from "next/image";
import Link from "next/link";
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
import { 
  Plane, 
  Clock, 
  DollarSign, 
  BarChart3,
  Calendar,
  MapPin,
  Fuel,
  Users,
  TrendingUp,
  AlertTriangle,
  Plus,
  Wrench,
  ArrowRight,
  Settings,
} from "lucide-react";

import { EditorPanel } from "@/components/editor/editor-panel";
import {
  DashboardPeriodSelector,
  type PeriodKey,
} from "@/components/dashboard/period-selector";
import { MonthlyTimeline } from "@/components/dashboard/monthly-timeline";
import { ExportPdfButton } from "@/components/dashboard/export-pdf-button";
import { LogoutButton } from "@/components/logout-button";
import { requireCurrentUser, getCurrentOrganization } from "@/lib/auth";
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
  if (Number.isNaN(date.getTime())) return "-";
  return format(date, "dd MMM", { locale: ptBR });
}

const ROLE_LABELS = {
  ADMIN: "Administrador",
  CONTROLLER: "Comandante",
  VIEWER: "Proprietário",
  PILOT: "Copiloto",
  CTM: "CTM",
} as const;

const PERIOD_DEFAULT: PeriodKey = "current-month";

function isPeriodKey(value: string): value is PeriodKey {
  return ["current-month", "last-3-months", "last-6-months", "year-to-date", "custom"].includes(value);
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
      const startParam = typeof searchParams.start === "string" ? parseISO(searchParams.start) : null;
      const endParam = typeof searchParams.end === "string" ? parseISO(searchParams.end) : null;
      if (startParam && isValid(startParam)) startDate = startOfDay(startParam);
      if (endParam && isValid(endParam)) endDate = endOfDay(endParam);
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

// Summary Card Component
function SummaryCard({ 
  icon, 
  label, 
  value, 
  subValue,
  color 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string | number;
  subValue?: string;
  color: string;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{label}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
          {subValue && (
            <p className="text-xs text-slate-400 mt-1">{subValue}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// Category icon mapping
const categoryIcons: Record<string, React.ReactNode> = {
  'FUEL': <Fuel className="w-5 h-5" />,
  'MAINTENANCE': <Wrench className="w-5 h-5" />,
  'HANGAR': <MapPin className="w-5 h-5" />,
  'INSURANCE': <AlertTriangle className="w-5 h-5" />,
  'AIRPORT_FEES': <DollarSign className="w-5 h-5" />,
};

const categoryColors: Record<string, string> = {
  'FUEL': 'bg-blue-50 text-blue-600',
  'MAINTENANCE': 'bg-green-50 text-green-600',
  'HANGAR': 'bg-purple-50 text-purple-600',
  'INSURANCE': 'bg-amber-50 text-amber-600',
  'AIRPORT_FEES': 'bg-red-50 text-red-600',
};

export default async function DashboardPage({
  searchParams = {},
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const { period, startDate, endDate } = resolvePeriod(searchParams);
  const user = await requireCurrentUser();
  const organization = await getCurrentOrganization();
  
  // Se não tiver organização, redireciona para onboarding
  if (!organization) {
    const { redirect } = await import("next/navigation");
    redirect("/onboarding");
    return null; // TypeScript precisa disso
  }
  
  const organizationId = organization.id;
  const memberRole = organization.memberRole;
  
  const data = await getDashboardData({ 
    startDate, 
    endDate, 
    organizationId 
  });
  
  // Verifica permissão de gerenciar baseado na role do membro na organização
  const canManage = ["OWNER", "ADMIN", "CONTROLLER"].includes(memberRole);
  
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

  const periodRangeLabel = `${format(startDate, "dd MMM yyyy", { locale: ptBR })} – ${format(endDate, "dd MMM yyyy", { locale: ptBR })}`;
  const monthsInRange = differenceInCalendarMonths(endOfMonth(endDate), startOfMonth(startDate)) + 1;
  const periodStartInput = format(startDate, "yyyy-MM-dd");
  const periodEndInput = format(endDate, "yyyy-MM-dd");
  const totalSharedAmount = totalCostInPeriod + totalExpensesInPeriod;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Air X Control</h1>
                <p className="text-xs text-slate-500">Painel Operacional</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Calendar Link */}
              <a
                href="/calendar"
                className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
                title="Calendário de Reservas"
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden md:inline">Reservas</span>
              </a>

              {/* User info */}
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{user.name}</p>
                  <p className="text-xs text-slate-500">{ROLE_LABELS[user.role as keyof typeof ROLE_LABELS] ?? "Colaborador"}</p>
                </div>
              </div>
              
              {canManage && (
                <Link
                  href="/admin"
                  className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                  title="Administração"
                >
                  <Settings className="w-5 h-5" />
                </Link>
              )}
              
              <LogoutButton 
                label=""
                variant="ghost"
                className="p-2 text-slate-500 hover:text-red-600 transition-colors"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Period Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5" />
              <div>
                <p className="font-medium">{periodRangeLabel}</p>
                <p className="text-sm text-blue-100">{monthsInRange} {monthsInRange === 1 ? "mês" : "meses"} analisados</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ExportPdfButton
                reportData={{
                  period: periodRangeLabel,
                  aircraft: "Todas",
                  totalExpenses: totalExpensesInPeriod,
                  totalFlights: flightsInPeriod,
                  totalHours: hoursInPeriod,
                  owners: owners.map((o, idx) => ({
                    name: o.name,
                    percentage: Math.round(100 / owners.length), // Divisão igual se não houver percentual
                    amount: totalSharedAmount / owners.length,
                  })),
                  expenses: expensesByCategory.map(e => ({
                    category: e.category,
                    amount: e.total,
                  })),
                  flights: recentFlights.map(f => ({
                    date: formatDate(f.flightDate),
                    origin: f.origin,
                    destination: f.destination,
                    hours: Number(f.durationHours) || 0,
                    pilot: f.pilot?.name ?? "N/A",
                  })),
                }}
              />
              <DashboardPeriodSelector
                period={period}
                startDate={periodStartInput}
                endDate={periodEndInput}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <SummaryCard
            icon={<Plane className="w-6 h-6 text-blue-600" />}
            label="Aeronaves Ativas"
            value={`${availableAircraft}/${totalAircraft}`}
            subValue="Disponíveis hoje"
            color="bg-blue-50 dark:bg-blue-900/30"
          />
          <SummaryCard
            icon={<Clock className="w-6 h-6 text-green-600" />}
            label="Horas Voadas"
            value={`${hoursInPeriod.toFixed(1)}h`}
            subValue={`Total da frota: ${totalFleetHours.toFixed(1)}h`}
            color="bg-green-50 dark:bg-green-900/30"
          />
          <SummaryCard
            icon={<BarChart3 className="w-6 h-6 text-purple-600" />}
            label="Voos Realizados"
            value={flightsInPeriod}
            subValue="No período selecionado"
            color="bg-purple-50 dark:bg-purple-900/30"
          />
          <SummaryCard
            icon={<DollarSign className="w-6 h-6 text-amber-600" />}
            label="Custo Total"
            value={formatCurrency(totalSharedAmount)}
            subValue={`Média/hora: ${formatCurrency(costPerHourInPeriod)}`}
            color="bg-amber-50 dark:bg-amber-900/30"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Flights */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="p-5 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Plane className="w-5 h-5 text-blue-500" />
                    Voos Recentes
                  </h2>
                  <span className="text-sm text-slate-500">{recentFlights.length} voos</span>
                </div>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {recentFlights.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">
                    Nenhum voo registrado no período.
                  </div>
                ) : (
                  recentFlights.slice(0, 4).map((flight: RecentFlight) => (
                    <div key={flight.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                            <Plane className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-900 dark:text-white">
                                {flight.origin}
                              </span>
                              <ArrowRight className="w-4 h-4 text-slate-400" />
                              <span className="font-semibold text-slate-900 dark:text-white">
                                {flight.destination}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {formatDate(flight.flightDate)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {flight.durationHours?.toFixed(1) ?? "-"}h
                              </span>
                              <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                                {flight.aircraft?.tailNumber ?? "-"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {formatCurrency(Number(flight.totalCost) || 0)}
                          </p>
                          <p className="text-xs text-slate-500">{flight.pilot?.name ?? "-"}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Expenses */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="p-5 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    Despesas Recentes
                  </h2>
                  <span className="text-sm text-slate-500">{recentExpenses.length} despesas</span>
                </div>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {recentExpenses.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">
                    Nenhuma despesa registrada no período.
                  </div>
                ) : (
                  recentExpenses.slice(0, 4).map((expense: RecentExpense) => (
                    <div key={expense.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${categoryColors[expense.category] || 'bg-slate-100 text-slate-600'}`}>
                            {categoryIcons[expense.category] || <DollarSign className="w-5 h-5" />}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{expense.notes || expense.category}</p>
                            <p className="text-sm text-slate-500">{formatDate(expense.expenseDate)}</p>
                          </div>
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {formatCurrency(expense.amount)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Monthly Timeline */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Evolução Mensal
              </h2>
              <MonthlyTimeline timeline={monthlyTimeline} />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Owner Division - Divisão de Custos */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="p-5 border-b border-slate-100 dark:border-slate-700">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-500" />
                  Divisão de Custos
                </h2>
                <p className="text-xs text-slate-500 mt-1">Período: {periodRangeLabel}</p>
              </div>
              <div className="p-5 space-y-4">
                {owners.length === 0 ? (
                  <p className="text-slate-500 text-center py-4">Nenhum coproprietário cadastrado.</p>
                ) : (
                  <>
                    {owners.map((owner) => (
                      <div key={owner.id} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                              {owner.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">{owner.name}</p>
                              <p className="text-xs text-slate-500">{ROLE_LABELS[owner.role as keyof typeof ROLE_LABELS] ?? owner.role}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-slate-900 dark:text-white">
                              {formatCurrency(owner.shareAmount)}
                            </p>
                            <p className="text-xs text-slate-500">{owner.ownershipPct.toFixed(1)}% de participação</p>
                          </div>
                        </div>
                        {/* Barra de progresso visual */}
                        <div className="mt-3 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all"
                            style={{ width: `${Math.min(owner.ownershipPct, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                    {/* Total */}
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Total do Período</span>
                        <span className="text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(totalSharedAmount)}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Expenses by Category */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Despesas por Categoria
              </h2>
              <div className="space-y-3">
                {expensesByCategory.length === 0 ? (
                  <p className="text-slate-500 text-center py-4">Nenhuma despesa no período.</p>
                ) : (
                  expensesByCategory.map((cat: ExpenseCategory) => {
                    const percentage = totalExpensesInPeriod > 0 ? (cat.total / totalExpensesInPeriod) * 100 : 0;
                    return (
                      <div key={cat.category}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-slate-600 dark:text-slate-300">{cat.category}</span>
                          <span className="font-medium text-slate-900 dark:text-white">
                            {formatCurrency(cat.total)}
                          </span>
                        </div>
                        <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full transition-all"
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Upcoming Flights */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-amber-500" />
                Próximos Voos
              </h2>
              <div className="space-y-3">
                {upcomingFlights.length === 0 ? (
                  <p className="text-slate-500 text-center py-4">Nenhum voo agendado.</p>
                ) : (
                  upcomingFlights.slice(0, 3).map((flight: UpcomingFlight) => (
                    <div 
                      key={flight.id}
                      className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {flight.origin} → {flight.destination}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            {flight.aircraft?.tailNumber ?? "-"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-amber-600">
                            {formatDate(flight.flightDate)}
                          </p>
                          <p className="text-xs text-slate-500">{flight.pilot?.name ?? "-"}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions */}
            {canManage && (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Ações Rápidas
                </h2>
                <div className="space-y-2">
                  <a 
                    href="#editor-panel"
                    className="w-full flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-xl text-blue-600 transition-colors cursor-pointer"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="font-medium">Registrar Novo Voo</span>
                    <ArrowRight className="w-4 h-4 ml-auto opacity-50" />
                  </a>
                  <a 
                    href="#editor-panel"
                    className="w-full flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-xl text-green-600 transition-colors cursor-pointer"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="font-medium">Adicionar Despesa</span>
                    <ArrowRight className="w-4 h-4 ml-auto opacity-50" />
                  </a>
                  <a 
                    href="#editor-panel"
                    className="w-full flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-xl text-purple-600 transition-colors cursor-pointer"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="font-medium">Nova Aeronave</span>
                    <ArrowRight className="w-4 h-4 ml-auto opacity-50" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Editor Panel */}
        {canManage && (
          <section id="editor-panel" className="mt-8 scroll-mt-20">
            <EditorPanel canManage={canManage} />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Plane className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-slate-900 dark:text-white">Air X Control</span>
            </div>
            <p className="text-sm text-slate-500">
              © 2025 Air X Control. Gestão Inteligente para Aviação Compartilhada.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
