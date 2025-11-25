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
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="text-center">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-amber-400" />
          <p className="mt-4 text-gray-400">Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="text-center">
          <XCircle className="mx-auto h-12 w-12 text-red-500" />
          <h1 className="mt-4 text-xl font-semibold text-white">Acesso Negado</h1>
          <p className="mt-2 text-gray-400">{error}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-6 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-amber-400"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="relative h-10 w-10">
              <Image src="/airx-logo.svg" alt="Air X Control" fill sizes="2.5rem" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Painel Administrativo</h1>
              <p className="text-sm text-gray-400">
                Logado como {currentUser?.name} ({ROLE_LABELS[currentUser?.role || "VIEWER"]})
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700"
            >
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg bg-red-600/20 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-600/30"
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
            <div className="rounded-xl bg-gray-800 p-4">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-400" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  <p className="text-sm text-gray-400">Usuários</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-gray-800 p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-400" />
                <div>
                  <p className="text-2xl font-bold">{stats.activeUsers}</p>
                  <p className="text-sm text-gray-400">Ativos</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-gray-800 p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-amber-400" />
                <div>
                  <p className="text-2xl font-bold">{stats.pendingDemos}</p>
                  <p className="text-sm text-gray-400">Demos Pendentes</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-gray-800 p-4">
              <div className="flex items-center gap-3">
                <Plane className="h-8 w-8 text-purple-400" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalFlights}</p>
                  <p className="text-sm text-gray-400">Voos</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-gray-800 p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-emerald-400" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalExpenses}</p>
                  <p className="text-sm text-gray-400">Despesas</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-gray-800">
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === "users"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <Users className="h-4 w-4" />
            Usuários ({users.length})
          </button>
          <button
            onClick={() => setActiveTab("demos")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === "demos"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <Calendar className="h-4 w-4" />
            Solicitações de Demo ({demoRequests.length})
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="rounded-xl bg-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-400">
                      Usuário
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-400">
                      Contato
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-400">
                      Papel
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-400">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-400">
                      Atividade
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-400">
                      Cadastro
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-700/30">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 text-sm font-semibold text-amber-400">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-white">{user.name}</p>
                            <p className="text-sm text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-400">
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
                          className="rounded-lg border border-gray-600 bg-gray-700 px-3 py-1.5 text-sm text-white focus:border-amber-400 focus:outline-none disabled:opacity-50"
                        >
                          {ROLE_OPTIONS.map((role) => (
                            <option key={role} value={role}>
                              {ROLE_LABELS[role]}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={user.status}
                          onChange={(e) => updateUserStatus(user.id, e.target.value)}
                          disabled={user.id === currentUser?.id}
                          className={`rounded-lg border px-3 py-1.5 text-sm focus:outline-none disabled:opacity-50 ${
                            user.status === "ACTIVE"
                              ? "border-green-600 bg-green-900/30 text-green-400"
                              : user.status === "INACTIVE"
                              ? "border-red-600 bg-red-900/30 text-red-400"
                              : "border-amber-600 bg-amber-900/30 text-amber-400"
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
                          <div className="flex items-center gap-2 text-gray-300">
                            <Plane className="h-3 w-3 text-purple-400" />
                            {user._count?.flightsAsPilot || 0} voos
                          </div>
                          <div className="flex items-center gap-2 text-gray-400">
                            <DollarSign className="h-3 w-3 text-emerald-400" />
                            {user._count?.expenses || 0} despesas
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
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
          <div className="rounded-xl bg-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-400">
                      Solicitante
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-400">
                      Empresa
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-400">
                      Data Preferida
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-400">
                      Mensagem
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-400">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-400">
                      Enviado em
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {demoRequests.map((demo) => (
                    <tr key={demo.id} className="hover:bg-gray-700/30">
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-white">{demo.name}</p>
                          <div className="mt-1 space-y-0.5">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Mail className="h-3 w-3" />
                              {demo.email}
                            </div>
                            {demo.phone && (
                              <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Phone className="h-3 w-3" />
                                {demo.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {demo.company ? (
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <Building className="h-4 w-4 text-gray-500" />
                            {demo.company}
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-300">
                        {demo.preferredDate
                          ? new Date(demo.preferredDate).toLocaleDateString("pt-BR")
                          : "-"}
                      </td>
                      <td className="max-w-xs px-4 py-4">
                        {demo.message ? (
                          <p className="truncate text-sm text-gray-400" title={demo.message}>
                            {demo.message}
                          </p>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={demo.status}
                          onChange={(e) => updateDemoStatus(demo.id, e.target.value)}
                          className={`rounded-lg border px-3 py-1.5 text-sm focus:outline-none ${
                            demo.status === "PENDING"
                              ? "border-amber-600 bg-amber-900/30 text-amber-400"
                              : demo.status === "CONTACTED"
                              ? "border-blue-600 bg-blue-900/30 text-blue-400"
                              : "border-green-600 bg-green-900/30 text-green-400"
                          }`}
                        >
                          {DEMO_STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {DEMO_STATUS_LABELS[status]}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-400">
                        {new Date(demo.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                    </tr>
                  ))}
                  {demoRequests.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
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
            className="flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700"
          >
            <RefreshCw className="h-4 w-4" />
            Atualizar Dados
          </button>
        </div>
      </main>
    </div>
  );
}
