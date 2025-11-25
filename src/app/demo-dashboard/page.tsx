'use client';

import { useState, useEffect } from 'react';
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
  ChevronRight,
  Wrench,
  ArrowRight,
  LogIn
} from 'lucide-react';
import { DemoTour } from '@/components/demo-tour';
import {
  demoAircraft,
  demoFlights,
  demoExpenses,
  demoSummary,
  demoCostDivision,
  demoExpensesByCategory,
  demoMonthlyData,
  demoUpcomingMaintenance,
} from '@/lib/demo-data';
import Link from 'next/link';

// Formatar data
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
  }).format(date);
}

// Formatar moeda
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Card de resumo
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

export default function DemoDashboardPage() {
  const [showTour, setShowTour] = useState(false);
  const [tourCompleted, setTourCompleted] = useState(false);

  useEffect(() => {
    // Check if tour was completed before
    const completed = localStorage.getItem('airx-tour-completed');
    if (!completed) {
      // Small delay for better UX
      const timer = setTimeout(() => setShowTour(true), 500);
      return () => clearTimeout(timer);
    } else {
      setTourCompleted(true);
    }
  }, []);

  const handleTourComplete = () => {
    setShowTour(false);
    setTourCompleted(true);
  };

  const restartTour = () => {
    localStorage.removeItem('airx-tour-completed');
    setShowTour(true);
    setTourCompleted(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Tour */}
      {showTour && <DemoTour onComplete={handleTourComplete} isDemo={true} />}

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
                <p className="text-xs text-slate-500">Modo Demonstração</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={restartTour}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Ver tour novamente
              </button>
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Entrar
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <p className="font-medium">Você está visualizando dados de demonstração</p>
                <p className="text-sm text-blue-100">Faça login para acessar seus dados reais</p>
              </div>
            </div>
            <Link
              href="/register"
              className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
            >
              Começar agora
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div data-tour="summary" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <SummaryCard
            icon={<Plane className="w-6 h-6 text-blue-600" />}
            label="Aeronaves Ativas"
            value={demoSummary.aircraftCount}
            subValue="PP-JCF, PP-XYZ"
            color="bg-blue-50 dark:bg-blue-900/30"
          />
          <SummaryCard
            icon={<Clock className="w-6 h-6 text-green-600" />}
            label="Horas Voadas"
            value={`${demoSummary.totalHours.toFixed(1)}h`}
            subValue="Últimos 30 dias"
            color="bg-green-50 dark:bg-green-900/30"
          />
          <SummaryCard
            icon={<BarChart3 className="w-6 h-6 text-purple-600" />}
            label="Voos Realizados"
            value={demoSummary.totalFlights}
            subValue="+2 vs. mês anterior"
            color="bg-purple-50 dark:bg-purple-900/30"
          />
          <SummaryCard
            icon={<DollarSign className="w-6 h-6 text-amber-600" />}
            label="Custo Total"
            value={formatCurrency(demoSummary.totalCosts)}
            subValue="Este mês"
            color="bg-amber-50 dark:bg-amber-900/30"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Flights */}
            <div data-tour="flights" className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="p-5 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Plane className="w-5 h-5 text-blue-500" />
                    Voos Recentes
                  </h2>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                    Ver todos
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {demoFlights.slice(0, 4).map((flight) => (
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
                              {flight.durationHours}h
                            </span>
                            <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                              {flight.aircraft.tailNumber}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {formatCurrency(flight.totalCost)}
                        </p>
                        <p className="text-xs text-slate-500">{flight.pilot.name}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expenses */}
            <div data-tour="expenses" className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="p-5 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    Despesas Recentes
                  </h2>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                    Ver todas
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {demoExpenses.slice(0, 4).map((expense) => (
                  <div key={expense.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          expense.category === 'FUEL' ? 'bg-blue-50 text-blue-600' :
                          expense.category === 'MAINTENANCE' ? 'bg-green-50 text-green-600' :
                          expense.category === 'HANGAR' ? 'bg-purple-50 text-purple-600' :
                          expense.category === 'INSURANCE' ? 'bg-amber-50 text-amber-600' :
                          'bg-red-50 text-red-600'
                        }`}>
                          {expense.category === 'FUEL' && <Fuel className="w-5 h-5" />}
                          {expense.category === 'MAINTENANCE' && <Wrench className="w-5 h-5" />}
                          {expense.category === 'HANGAR' && <MapPin className="w-5 h-5" />}
                          {expense.category === 'INSURANCE' && <AlertTriangle className="w-5 h-5" />}
                          {expense.category === 'AIRPORT_FEES' && <DollarSign className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{expense.notes}</p>
                          <p className="text-sm text-slate-500">{formatDate(expense.expenseDate)}</p>
                        </div>
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(expense.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Chart */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Evolução Mensal
              </h2>
              <div className="h-48 flex items-end justify-between gap-2">
                {demoMonthlyData.map((month, i) => {
                  // Use predefined height classes based on cost relative to max (25000)
                  const heightClasses = ['bar-h-50', 'bar-h-76', 'bar-h-61', 'bar-h-91', 'bar-h-58', 'bar-h-99'];
                  return (
                    <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
                      <div 
                        className={`w-full bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600 monthly-bar ${heightClasses[i]}`}
                      />
                      <span className="text-xs text-slate-500">{month.month}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center border-t border-slate-100 dark:border-slate-700 pt-4">
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">27</p>
                  <p className="text-xs text-slate-500">Voos no período</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">35.0h</p>
                  <p className="text-xs text-slate-500">Horas totais</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(108990)}</p>
                  <p className="text-xs text-slate-500">Custo total</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Owner Division */}
            <div data-tour="owners" className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="p-5 border-b border-slate-100 dark:border-slate-700">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-500" />
                  Divisão de Custos
                </h2>
              </div>
              <div className="p-5 space-y-4">
                {demoCostDivision.map((owner) => (
                  <div key={owner.id} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                          {owner.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{owner.name}</p>
                          <p className="text-xs text-slate-500">{owner.share}% de participação</p>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-slate-900 dark:text-white">
                        {formatCurrency(owner.totalShare)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs mt-3">
                      <div className="bg-white dark:bg-slate-800 rounded-lg p-2">
                        <p className="text-slate-500">Horas voadas</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{owner.hoursFlown}h</p>
                      </div>
                      <div className="bg-white dark:bg-slate-800 rounded-lg p-2">
                        <p className="text-slate-500">Voos</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{owner.flightsCount}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expenses by Category */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Despesas por Categoria
              </h2>
              <div className="space-y-3">
                {demoExpensesByCategory.map((cat) => {
                  // Map category to Tailwind classes
                  const categoryStyles: Record<string, { colorClass: string; widthClass: string }> = {
                    'FUEL': { colorClass: 'progress-fuel', widthClass: 'progress-w-30' },
                    'MAINTENANCE': { colorClass: 'progress-maintenance', widthClass: 'progress-w-34' },
                    'HANGAR': { colorClass: 'progress-hangar', widthClass: 'progress-w-18' },
                    'INSURANCE': { colorClass: 'progress-insurance', widthClass: 'progress-w-10' },
                    'AIRPORT_FEES': { colorClass: 'progress-fees', widthClass: 'progress-w-8' },
                  };
                  const styles = categoryStyles[cat.category] || { colorClass: 'bg-slate-500', widthClass: 'w-1/4' };
                  
                  return (
                    <div key={cat.category}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-600 dark:text-slate-300">{cat.label}</span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {formatCurrency(cat.total)}
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full expense-progress ${styles.colorClass} ${styles.widthClass}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Upcoming Maintenance */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <Wrench className="w-5 h-5 text-amber-500" />
                Próximas Manutenções
              </h2>
              <div className="space-y-3">
                {demoUpcomingMaintenance.map((maint, i) => (
                  <div 
                    key={i}
                    className={`p-3 rounded-lg border ${
                      maint.status === 'urgent' 
                        ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700' 
                        : 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{maint.aircraft}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{maint.type}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          maint.status === 'urgent' ? 'text-red-600' : 'text-amber-600'
                        }`}>
                          {maint.daysRemaining} dias
                        </p>
                        <p className="text-xs text-slate-500">restantes</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div data-tour="actions" className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Ações Rápidas
              </h2>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-xl text-blue-600 transition-colors">
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Registrar Novo Voo</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-xl text-green-600 transition-colors">
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Adicionar Despesa</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-xl text-purple-600 transition-colors">
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Nova Aeronave</span>
                </button>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Pronto para começar?</h3>
              <p className="text-sm text-blue-100 mb-4">
                Crie sua conta e comece a gerenciar suas aeronaves com transparência total.
              </p>
              <Link
                href="/register"
                className="block w-full text-center py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Criar Minha Conta
              </Link>
            </div>
          </div>
        </div>
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
