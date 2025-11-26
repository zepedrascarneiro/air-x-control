"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Settings,
  Users,
  Copy,
  Check,
  Mail,
  UserPlus,
  Shield,
  Percent,
  Trash2,
  ArrowLeft,
  Building2,
  Loader2,
  AlertCircle,
  Crown,
  Eye,
  Pencil,
} from "lucide-react";

interface Member {
  id: string;
  role: string;
  ownershipPct: number;
  status: string;
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
}

interface Organization {
  id: string;
  name: string;
  slug: string;
  shareCode: string;
  plan: string;
  status: string;
}

const roleLabels: Record<string, string> = {
  OWNER: "Proprietário",
  ADMIN: "Administrador",
  CONTROLLER: "Controlador",
  PILOT: "Piloto",
  VIEWER: "Visualizador",
};

const roleColors: Record<string, string> = {
  OWNER: "bg-amber-100 text-amber-800",
  ADMIN: "bg-purple-100 text-purple-800",
  CONTROLLER: "bg-blue-100 text-blue-800",
  PILOT: "bg-green-100 text-green-800",
  VIEWER: "bg-slate-100 text-slate-800",
};

const roleIcons: Record<string, React.ReactNode> = {
  OWNER: <Crown className="w-3 h-3" />,
  ADMIN: <Shield className="w-3 h-3" />,
  CONTROLLER: <Pencil className="w-3 h-3" />,
  PILOT: <Users className="w-3 h-3" />,
  VIEWER: <Eye className="w-3 h-3" />,
};

export default function SettingsPage() {
  const router = useRouter();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("VIEWER");
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState("");
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");

  const loadData = useCallback(async () => {
    try {
      // Carregar organização
      const orgRes = await fetch("/api/organizations");
      if (!orgRes.ok) {
        router.push("/onboarding");
        return;
      }
      const orgData = await orgRes.json();
      setOrganization(orgData.organization);
      setCurrentUserId(orgData.userId);
      setUserRole(orgData.role);

      // Carregar membros
      const membersRes = await fetch("/api/organizations/members");
      if (membersRes.ok) {
        const membersData = await membersRes.json();
        setMembers(membersData.members);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const copyShareCode = async () => {
    if (!organization) return;
    await navigator.clipboard.writeText(organization.shareCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError("");
    setInviteSuccess("");
    setInviting(true);

    try {
      const res = await fetch("/api/organizations/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });

      const data = await res.json();

      if (res.ok) {
        setInviteSuccess(`Convite enviado para ${inviteEmail}`);
        setInviteEmail("");
      } else {
        setInviteError(data.error || "Erro ao enviar convite");
      }
    } catch {
      setInviteError("Erro ao conectar com o servidor");
    } finally {
      setInviting(false);
    }
  };

  const updateMember = async (memberId: string, updates: Partial<Member>) => {
    try {
      const res = await fetch("/api/organizations/members", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId, ...updates }),
      });

      if (res.ok) {
        loadData();
        setEditingMember(null);
      }
    } catch (error) {
      console.error("Erro ao atualizar membro:", error);
    }
  };

  const removeMember = async (memberId: string) => {
    if (!confirm("Tem certeza que deseja remover este membro?")) return;

    try {
      const res = await fetch(`/api/organizations/members?memberId=${memberId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        loadData();
      }
    } catch (error) {
      console.error("Erro ao remover membro:", error);
    }
  };

  const canManage = ["OWNER", "ADMIN", "CONTROLLER"].includes(userRole);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!organization) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Configurações</h1>
              <p className="text-sm text-slate-500">{organization.name}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Código de Compartilhamento */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Código de Compartilhamento
              </h2>
              <p className="text-sm text-slate-500">
                Compartilhe este código para convidar novos membros
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 bg-slate-100 rounded-xl px-6 py-4 font-mono text-2xl font-bold text-slate-900 tracking-wider text-center">
              {organization.shareCode}
            </div>
            <button
              onClick={copyShareCode}
              className="flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copiar
                </>
              )}
            </button>
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Novos usuários podem usar este código ao se cadastrar para entrar automaticamente na sua organização.
          </p>
        </section>

        {/* Convidar por Email */}
        {canManage && (
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Convidar por Email
                </h2>
                <p className="text-sm text-slate-500">
                  Envie um convite direto para um email
                </p>
              </div>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="email@exemplo.com"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  title="Papel do membro"
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="VIEWER">Visualizador</option>
                  <option value="PILOT">Piloto</option>
                  <option value="CONTROLLER">Controlador</option>
                  <option value="ADMIN">Administrador</option>
                </select>
                <button
                  type="submit"
                  disabled={inviting || !inviteEmail}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium rounded-xl transition-colors flex items-center gap-2"
                >
                  {inviting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Mail className="w-5 h-5" />
                  )}
                  Enviar
                </button>
              </div>

              {inviteError && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-4 py-2 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  {inviteError}
                </div>
              )}

              {inviteSuccess && (
                <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 px-4 py-2 rounded-lg">
                  <Check className="w-4 h-4" />
                  {inviteSuccess}
                </div>
              )}
            </form>
          </section>
        )}

        {/* Lista de Membros */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Membros ({members.length})
              </h2>
              <p className="text-sm text-slate-500">
                Gerencie os membros da sua organização
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl"
              >
                {/* Avatar */}
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {member.user.name.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900 truncate">
                      {member.user.name}
                      {member.user.id === currentUserId && (
                        <span className="text-sm text-slate-500 font-normal ml-1">
                          (você)
                        </span>
                      )}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-500 truncate">
                    {member.user.email}
                  </p>
                </div>

                {/* Role Badge */}
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                      roleColors[member.role]
                    }`}
                  >
                    {roleIcons[member.role]}
                    {roleLabels[member.role]}
                  </span>
                </div>

                {/* Ownership */}
                {editingMember === member.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      defaultValue={member.ownershipPct}
                      min="0"
                      max="100"
                      title="Percentual de participação"
                      placeholder="0"
                      className="w-20 px-3 py-2 bg-white border border-slate-200 rounded-lg text-center"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          updateMember(member.id, {
                            ownershipPct: parseFloat(
                              (e.target as HTMLInputElement).value
                            ),
                          });
                        }
                      }}
                    />
                    <span className="text-slate-500">%</span>
                    <button
                      onClick={() => setEditingMember(null)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => canManage && setEditingMember(member.id)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm ${
                      canManage
                        ? "bg-slate-100 hover:bg-slate-200 cursor-pointer"
                        : "bg-slate-100 cursor-default"
                    }`}
                    disabled={!canManage}
                  >
                    <Percent className="w-4 h-4 text-slate-500" />
                    <span className="font-medium text-slate-700">
                      {member.ownershipPct}%
                    </span>
                  </button>
                )}

                {/* Actions */}
                {canManage && member.role !== "OWNER" && member.user.id !== currentUserId && (
                  <button
                    onClick={() => removeMember(member.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remover membro"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}

            {members.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Nenhum membro encontrado</p>
              </div>
            )}
          </div>
        </section>

        {/* Info da Organização */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Informações da Organização
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-sm text-slate-500 mb-1">Nome</p>
              <p className="font-semibold text-slate-900">{organization.name}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-sm text-slate-500 mb-1">Plano</p>
              <p className="font-semibold text-slate-900 capitalize">
                {organization.plan === "FREE" ? "Gratuito" : organization.plan}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-sm text-slate-500 mb-1">Slug</p>
              <p className="font-semibold text-slate-900">{organization.slug}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-sm text-slate-500 mb-1">Status</p>
              <p className="font-semibold text-green-600">
                {organization.status === "ACTIVE" ? "Ativo" : organization.status}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
