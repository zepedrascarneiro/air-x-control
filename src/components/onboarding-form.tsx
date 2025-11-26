"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Users, ArrowRight, Loader2, CheckCircle, AlertCircle } from "lucide-react";

type Mode = "choose" | "create" | "join";

interface OnboardingFormProps {
  userName: string;
}

export function OnboardingForm({ userName }: OnboardingFormProps) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("choose");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form fields
  const [organizationName, setOrganizationName] = useState(`Aeronave de ${userName.split(" ")[0]}`);
  const [shareCode, setShareCode] = useState("");
  const [previewOrg, setPreviewOrg] = useState<{ name: string; membersCount: number } | null>(null);

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: organizationName }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erro ao criar organização");
      }

      setSuccess("Organização criada com sucesso!");
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar organização");
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewCode = async () => {
    if (shareCode.length < 5) return;
    
    setLoading(true);
    setError(null);
    setPreviewOrg(null);

    try {
      const res = await fetch(`/api/organizations/join?code=${encodeURIComponent(shareCode)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Código inválido");
      }

      setPreviewOrg(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Código inválido");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/organizations/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: shareCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erro ao entrar na organização");
      }

      setSuccess("Você entrou na organização!");
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao entrar na organização");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <p className="text-white text-lg">{success}</p>
        <p className="text-blue-200 text-sm mt-2">Redirecionando...</p>
      </div>
    );
  }

  if (mode === "choose") {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white text-center mb-6">
          Como você quer começar?
        </h2>

        <button
          onClick={() => setMode("create")}
          className="w-full flex items-center gap-4 p-4 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/30 rounded-xl transition-all group"
        >
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-white">Criar Nova Conta</p>
            <p className="text-sm text-blue-200">Sou o dono/administrador da aeronave</p>
          </div>
          <ArrowRight className="w-5 h-5 text-blue-300 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={() => setMode("join")}
          className="w-full flex items-center gap-4 p-4 bg-green-600/30 hover:bg-green-600/50 border border-green-500/30 rounded-xl transition-all group"
        >
          <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-white">Entrar com Código</p>
            <p className="text-sm text-green-200">Tenho um código de convite</p>
          </div>
          <ArrowRight className="w-5 h-5 text-green-300 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  }

  if (mode === "create") {
    return (
      <form onSubmit={handleCreateOrganization} className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <button
            type="button"
            onClick={() => setMode("choose")}
            className="text-blue-300 hover:text-white text-sm"
          >
            ← Voltar
          </button>
        </div>

        <h2 className="text-xl font-semibold text-white">
          Criar Nova Conta
        </h2>

        {/* Trial Banner */}
        <div className="bg-gradient-to-r from-blue-600/30 to-indigo-600/30 border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="text-white font-medium">7 dias de PRO grátis!</p>
              <p className="text-blue-200 text-sm">Acesso completo a todas as funcionalidades</p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-200 mb-2">
            Nome da Conta / Aeronave
          </label>
          <input
            type="text"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            placeholder="Ex: PS-SRQ, Cirrus SR22, Minha Aeronave"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            minLength={3}
          />
          <p className="text-xs text-blue-300/60 mt-1">
            Pode ser o prefixo da aeronave ou nome do grupo
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-400 bg-red-500/20 px-4 py-2 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || organizationName.length < 3}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Criando...
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              Criar Conta
            </>
          )}
        </button>
      </form>
    );
  }

  if (mode === "join") {
    return (
      <form onSubmit={handleJoinOrganization} className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <button
            type="button"
            onClick={() => { setMode("choose"); setPreviewOrg(null); setError(null); }}
            className="text-blue-300 hover:text-white text-sm"
          >
            ← Voltar
          </button>
        </div>

        <h2 className="text-xl font-semibold text-white">
          Entrar com Código
        </h2>

        <div>
          <label className="block text-sm font-medium text-blue-200 mb-2">
            Código de Compartilhamento
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={shareCode}
              onChange={(e) => {
                setShareCode(e.target.value.toUpperCase());
                setPreviewOrg(null);
                setError(null);
              }}
              placeholder="AIRX-XXXX"
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-green-500 uppercase tracking-wider font-mono"
              required
              minLength={5}
            />
            <button
              type="button"
              onClick={handlePreviewCode}
              disabled={loading || shareCode.length < 5}
              className="px-4 py-3 bg-green-600/50 hover:bg-green-600 disabled:bg-green-600/30 text-white rounded-xl transition-colors"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verificar"}
            </button>
          </div>
          <p className="text-xs text-blue-300/60 mt-1">
            Peça o código ao administrador da aeronave
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-400 bg-red-500/20 px-4 py-2 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {previewOrg && (
          <div className="bg-green-600/20 border border-green-500/30 rounded-xl p-4">
            <p className="text-green-300 text-sm mb-1">Organização encontrada:</p>
            <p className="text-white font-semibold text-lg">{previewOrg.name}</p>
            <p className="text-green-300/60 text-sm">
              {previewOrg.membersCount} {previewOrg.membersCount === 1 ? "membro" : "membros"}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !previewOrg}
          className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Entrando...
            </>
          ) : (
            <>
              <Users className="w-5 h-5" />
              Entrar na Organização
            </>
          )}
        </button>
      </form>
    );
  }

  return null;
}
