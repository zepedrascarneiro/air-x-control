"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
  UserCog,
  LogOut,
  RefreshCw,
  Plane,
  DollarSign,
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
  const [activeTab, setActiveTab] = useState<"users" | "demos" | "stats">("users");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin");
      if (response.status === 401) {
        router.push("/login");
        return;
      }
      if (response.status === 403) {
        setError("Acesso negado. Apenas administradores podem acessar esta página.");
        setLoading(false);
        return;
      }
      if (!response.ok) {
        throw new Error("Erro ao carregar dados");
      }
      const data = await response.json();
      setCurrentUser(data.currentUser);
      setUsers(data.users);
      setDemoRequests(data.demoRequests);
      setStats(data.stats);
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
