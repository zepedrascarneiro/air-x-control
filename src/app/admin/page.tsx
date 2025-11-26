"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  Building,
  LogOut,
  RefreshCw,
  Plane,
  DollarSign,
  TrendingUp,
  CreditCard,
  Sparkles,
  AlertTriangle,
  BarChart3,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  phone: string | null;
  ownershipPct: number | null;
  createdAt: string;
  _count?: {
    flightsAsPilot: number;
    expenses: number;
  };
}

interface DemoRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  preferredDate: string | null;
  message: string | null;
  status: string;
  createdAt: string;
}

interface Stats {
  totalUsers: number;
  activeUsers: number;
  pendingDemos: number;
  totalFlights: number;
  totalExpenses: number;
}

interface SaaSMetrics {
  totalOrganizations: number;
  activeSubscriptions: number;
  trialsActive: number;
  mrr: number;
  arr: number;
  newOrgsThisMonth: number;
  newOrgsLastMonth: number;
  growthRate: number;
  planDistribution: {
    plan: string;
    count: number;
    percentage: number;
  }[];
  subscriptionStatus: {
    active: number;
    trialing: number;
    past_due: number;
    canceled: number;
    none: number;
  };
  trialMetrics: {
    active: number;
    expiringSoon: number;
    convertedThisMonth: number;
  };
  revenueHistory: {
    month: string;
    mrr: number;
    newCustomers: number;
    churned: number;
  }[];
  recentOrganizations: {
    id: string;
    name: string;
    plan: string;
    status: string;
    subscriptionStatus: string | null;
    memberCount: number;
    aircraftCount: number;
    createdAt: string;
    trialEndsAt: string | null;
  }[];
}

const ROLE_OPTIONS = ["ADMIN", "CONTROLLER", "PILOT", "VIEWER", "CTM"];
const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administrador",
  CONTROLLER: "Controlador",
  PILOT: "Piloto",
  VIEWER: "Visualizador",
  CTM: "Manutenção",
};

const STATUS_OPTIONS = ["ACTIVE", "INACTIVE", "PENDING"];
const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
  PENDING: "Pendente",
};

const DEMO_STATUS_OPTIONS = ["PENDING", "CONTACTED", "CLOSED"];
const DEMO_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendente",
  CONTACTED: "Contatado",
  CLOSED: "Fechado",
};

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [demoRequests, setDemoRequests] = useState<DemoRequest[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [saasMetrics, setSaasMetrics] = useState<SaaSMetrics | null>(null);
  const [activeTab, setActiveTab] = useState<"users" | "demos" | "saas">("saas");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      // Carregar dados em paralelo
      const [adminResponse, saasResponse] = await Promise.all([
        fetch("/api/admin"),
        fetch("/api/admin/saas-metrics"),
      ]);
      
      if (adminResponse.status === 401) {
        router.push("/login");
        return;
      }
      if (adminResponse.status === 403) {
        setError("Acesso negado. Apenas administradores podem acessar esta página.");
        setLoading(false);
        return;
      }
      if (!adminResponse.ok) {
        throw new Error("Erro ao carregar dados");
      }
      
      const adminData = await adminResponse.json();
      setCurrentUser(adminData.currentUser);
      setUsers(adminData.users);
      setDemoRequests(adminData.demoRequests);
      setStats(adminData.stats);
      
      // Carregar métricas SaaS se disponível
      if (saasResponse.ok) {
        const saasData = await saasResponse.json();
        setSaasMetrics(saasData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  async function updateUserRole(userId: string, newRole: string) {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (!response.ok) throw new Error("Erro ao atualizar usuário");
      loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao atualizar");
    }
  }

  async function updateUserStatus(userId: string, newStatus: string) {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error("Erro ao atualizar usuário");
      loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao atualizar");
    }
  }

  async function updateUserOwnership(userId: string, newPct: number) {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownershipPct: newPct }),
      });
      if (!response.ok) throw new Error("Erro ao atualizar participação");
      loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao atualizar");
    }
  }

  async function updateDemoStatus(demoId: string, newStatus: string) {
    try {
      const response = await fetch(`/api/admin/demos/${demoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error("Erro ao atualizar demo");
      loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao atualizar");
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-4 text-slate-500">Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <XCircle className="mx-auto h-12 w-12 text-red-500" />
          <h1 className="mt-4 text-xl font-semibold text-slate-900">Acesso Negado</h1>
          <p className="mt-2 text-slate-500">{error}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Painel Administrativo</h1>
              <p className="text-sm text-slate-500">
                Logado como {currentUser?.name} ({ROLE_LABELS[currentUser?.role || "VIEWER"]})
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <Plane className="h-4 w-4" />
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5">
            <div className="rounded-xl bg-white p-5 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-blue-50">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalUsers}</p>
                  <p className="text-sm text-slate-500">Usuários</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-white p-5 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-green-50">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stats.activeUsers}</p>
                  <p className="text-sm text-slate-500">Ativos</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-white p-5 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-amber-50">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stats.pendingDemos}</p>
                  <p className="text-sm text-slate-500">Demos Pendentes</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-white p-5 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-purple-50">
                  <Plane className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalFlights}</p>
                  <p className="text-sm text-slate-500">Voos</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-white p-5 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-emerald-50">
                  <DollarSign className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalExpenses}</p>
                  <p className="text-sm text-slate-500">Despesas</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("saas")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === "saas"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            Métricas SaaS
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === "users"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Users className="h-4 w-4" />
            Usuários ({users.length})
          </button>
          <button
            onClick={() => setActiveTab("demos")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === "demos"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Calendar className="h-4 w-4" />
            Solicitações de Demo ({demoRequests.length})
          </button>
        </div>

        {/* SaaS Metrics Tab */}
        {activeTab === "saas" && saasMetrics && (
          <div className="space-y-6">
            {/* KPI Cards - Receita */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-5 text-white shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-white/20">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">
                      R$ {saasMetrics.mrr.toLocaleString("pt-BR")}
                    </p>
                    <p className="text-sm text-emerald-100">MRR (Receita Mensal)</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-5 text-white shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-white/20">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">
                      R$ {saasMetrics.arr.toLocaleString("pt-BR")}
                    </p>
                    <p className="text-sm text-blue-100">ARR (Receita Anual)</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-5 text-white shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-white/20">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{saasMetrics.activeSubscriptions}</p>
                    <p className="text-sm text-purple-100">Assinaturas Ativas</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 p-5 text-white shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-white/20">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{saasMetrics.trialsActive}</p>
                    <p className="text-sm text-amber-100">Trials Ativos</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Growth & Status Cards */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Crescimento */}
              <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Crescimento
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Este mês</span>
                    <span className="text-xl font-bold text-slate-900">+{saasMetrics.newOrgsThisMonth}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Mês anterior</span>
                    <span className="text-lg text-slate-700">{saasMetrics.newOrgsLastMonth}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Taxa de crescimento</span>
                      <span className={`text-lg font-bold ${saasMetrics.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {saasMetrics.growthRate >= 0 ? '+' : ''}{saasMetrics.growthRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Distribuição por Plano */}
              <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  Distribuição por Plano
                </h3>
                <div className="space-y-3">
                  {saasMetrics.planDistribution.map((plan) => (
                    <div key={plan.plan}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-slate-700">{plan.plan}</span>
                        <span className="text-sm text-slate-500">{plan.count} ({plan.percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            plan.plan === 'FREE' ? 'bg-slate-400' :
                            plan.plan === 'PRO' ? 'bg-blue-500' :
                            'bg-purple-500'
                          }`}
                          style={{ width: `${plan.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status das Assinaturas */}
              <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-emerald-600" />
                  Status das Assinaturas
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-green-500"></span>
                      <span className="text-slate-600">Ativas</span>
                    </span>
                    <span className="font-semibold">{saasMetrics.subscriptionStatus.active}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                      <span className="text-slate-600">Em trial</span>
                    </span>
                    <span className="font-semibold">{saasMetrics.subscriptionStatus.trialing}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-500"></span>
                      <span className="text-slate-600">Pagamento pendente</span>
                    </span>
                    <span className="font-semibold">{saasMetrics.subscriptionStatus.past_due}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-slate-400"></span>
                      <span className="text-slate-600">Canceladas</span>
                    </span>
                    <span className="font-semibold">{saasMetrics.subscriptionStatus.canceled}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trial Metrics */}
            <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-600" />
                Métricas de Trial
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 rounded-lg bg-amber-50">
                  <p className="text-3xl font-bold text-amber-600">{saasMetrics.trialMetrics.active}</p>
                  <p className="text-sm text-amber-700">Trials Ativos</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-red-50">
                  <p className="text-3xl font-bold text-red-600">{saasMetrics.trialMetrics.expiringSoon}</p>
                  <p className="text-sm text-red-700">Expirando em 3 dias</p>
                  {saasMetrics.trialMetrics.expiringSoon > 0 && (
                    <div className="mt-2 flex items-center justify-center gap-1 text-xs text-red-600">
                      <AlertTriangle className="h-3 w-3" />
                      Requer atenção!
                    </div>
                  )}
                </div>
                <div className="text-center p-4 rounded-lg bg-green-50">
                  <p className="text-3xl font-bold text-green-600">{saasMetrics.trialMetrics.convertedThisMonth}</p>
                  <p className="text-sm text-green-700">Conversões este mês</p>
                </div>
              </div>
            </div>

            {/* Organizações Recentes */}
            <div className="rounded-xl bg-white shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  Organizações Recentes
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Organização</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Plano</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Membros</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Aeronaves</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Criado em</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Trial</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {saasMetrics.recentOrganizations.map((org) => (
                      <tr key={org.id} className="hover:bg-slate-50">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white">
                              {org.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-slate-900">{org.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            org.plan === 'PRO' ? 'bg-blue-100 text-blue-800' :
                            org.plan === 'ENTERPRISE' ? 'bg-purple-100 text-purple-800' :
                            'bg-slate-100 text-slate-800'
                          }`}>
                            {org.plan}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            org.subscriptionStatus === 'active' ? 'bg-green-100 text-green-800' :
                            org.subscriptionStatus === 'trialing' ? 'bg-amber-100 text-amber-800' :
                            org.subscriptionStatus === 'past_due' ? 'bg-red-100 text-red-800' :
                            'bg-slate-100 text-slate-800'
                          }`}>
                            {org.subscriptionStatus || 'Sem assinatura'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-600">{org.memberCount}</td>
                        <td className="px-4 py-4 text-sm text-slate-600">{org.aircraftCount}</td>
                        <td className="px-4 py-4 text-sm text-slate-500">
                          {new Date(org.createdAt).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="px-4 py-4">
                          {org.trialEndsAt ? (
                            <span className={`text-sm ${
                              new Date(org.trialEndsAt) < new Date() ? 'text-red-600' : 'text-amber-600'
                            }`}>
                              {new Date(org.trialEndsAt) < new Date() ? 'Expirado' : 
                                `${Math.ceil((new Date(org.trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} dias`
                              }
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {saasMetrics.recentOrganizations.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                          Nenhuma organização cadastrada
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="rounded-xl bg-white shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                      Usuário
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                      Contato
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                      Papel
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                      Participação %
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                      Atividade
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                      Cadastro
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{user.name}</p>
                            <p className="text-sm text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <Phone className="h-3 w-3" />
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={user.role}
                          onChange={(e) => updateUserRole(user.id, e.target.value)}
                          disabled={user.id === currentUser?.id}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                        >
                          {ROLE_OPTIONS.map((role) => (
                            <option key={role} value={role}>
                              {ROLE_LABELS[role]}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={user.ownershipPct || 0}
                            onChange={(e) => updateUserOwnership(user.id, parseFloat(e.target.value) || 0)}
                            className="w-20 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            title="Percentual de participação"
                          />
                          <span className="text-sm text-slate-500">%</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={user.status}
                          onChange={(e) => updateUserStatus(user.id, e.target.value)}
                          disabled={user.id === currentUser?.id}
                          title="Status do usuário"
                          className={`rounded-lg border px-3 py-1.5 text-sm font-medium focus:outline-none disabled:opacity-50 ${
                            user.status === "ACTIVE"
                              ? "border-green-200 bg-green-50 text-green-700"
                              : user.status === "INACTIVE"
                              ? "border-red-200 bg-red-50 text-red-700"
                              : "border-amber-200 bg-amber-50 text-amber-700"
                          }`}
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {STATUS_LABELS[status]}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Plane className="h-3 w-3 text-purple-500" />
                            {user._count?.flightsAsPilot || 0} voos
                          </div>
                          <div className="flex items-center gap-2 text-slate-500">
                            <DollarSign className="h-3 w-3 text-emerald-500" />
                            {user._count?.expenses || 0} despesas
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-500">
                        {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                        Nenhum usuário cadastrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Demo Requests Tab */}
        {activeTab === "demos" && (
          <div className="rounded-xl bg-white shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                      Solicitante
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                      Empresa
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                      Data Preferida
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                      Mensagem
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                      Enviado em
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {demoRequests.map((demo) => (
                    <tr key={demo.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-slate-900">{demo.name}</p>
                          <div className="mt-1 space-y-0.5">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <Mail className="h-3 w-3" />
                              {demo.email}
                            </div>
                            {demo.phone && (
                              <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Phone className="h-3 w-3" />
                                {demo.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {demo.company ? (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Building className="h-4 w-4 text-slate-400" />
                            {demo.company}
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600">
                        {demo.preferredDate
                          ? new Date(demo.preferredDate).toLocaleDateString("pt-BR")
                          : "-"}
                      </td>
                      <td className="max-w-xs px-4 py-4">
                        {demo.message ? (
                          <p className="truncate text-sm text-slate-500" title={demo.message}>
                            {demo.message}
                          </p>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={demo.status}
                          onChange={(e) => updateDemoStatus(demo.id, e.target.value)}
                          className={`rounded-lg border px-3 py-1.5 text-sm font-medium focus:outline-none ${
                            demo.status === "PENDING"
                              ? "border-amber-200 bg-amber-50 text-amber-700"
                              : demo.status === "CONTACTED"
                              ? "border-blue-200 bg-blue-50 text-blue-700"
                              : "border-green-200 bg-green-50 text-green-700"
                          }`}
                        >
                          {DEMO_STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {DEMO_STATUS_LABELS[status]}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-500">
                        {new Date(demo.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                    </tr>
                  ))}
                  {demoRequests.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                        Nenhuma solicitação de demo
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Refresh Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={loadData}
            className="flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RefreshCw className="h-4 w-4" />
            Atualizar Dados
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-slate-900">Air X Control - Admin</span>
            </div>
            <p className="text-sm text-slate-500">
              © 2025 Air X Control. Painel Administrativo.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
