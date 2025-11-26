"use client";

import { useState } from "react";
import {
  AlertTriangle,
  X,
  Loader2,
  MessageSquare,
  ChevronDown,
  CheckCircle,
  HeartCrack,
} from "lucide-react";

interface CancelSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  planName: string;
  periodEnd?: string;
}

const CANCELLATION_REASONS = [
  { value: "too_expensive", label: "Muito caro para minha necessidade" },
  { value: "missing_features", label: "Faltam funcionalidades que preciso" },
  { value: "switched_competitor", label: "Estou usando outro serviço" },
  { value: "not_using_enough", label: "Não estou usando o suficiente" },
  { value: "technical_issues", label: "Problemas técnicos" },
  { value: "temporary_pause", label: "Pausa temporária" },
  { value: "other", label: "Outro motivo" },
];

export function CancelSubscriptionModal({
  isOpen,
  onClose,
  onSuccess,
  planName,
  periodEnd,
}: CancelSubscriptionModalProps) {
  const [step, setStep] = useState<"confirm" | "reason" | "success">("confirm");
  const [reason, setReason] = useState("");
  const [feedback, setFeedback] = useState("");
  const [cancelImmediately, setCancelImmediately] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleCancel = async () => {
    if (!reason) {
      setError("Por favor, selecione um motivo");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/stripe/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason,
          feedback,
          cancelImmediately,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao cancelar assinatura");
      }

      setStep("success");
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep("confirm");
    setReason("");
    setFeedback("");
    setCancelImmediately(false);
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            {step === "success" ? (
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            ) : (
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
            )}
            <h2 className="text-xl font-semibold text-slate-900">
              {step === "success"
                ? "Cancelamento Confirmado"
                : "Cancelar Assinatura"}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === "confirm" && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex gap-3">
                  <HeartCrack className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-amber-800 mb-1">
                      Sentiremos sua falta!
                    </h3>
                    <p className="text-sm text-amber-700">
                      Você está prestes a cancelar o plano <strong>{planName}</strong>.
                      Tem certeza que deseja continuar?
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-slate-900">O que você vai perder:</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    Acesso a múltiplas aeronaves
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    Usuários ilimitados na organização
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    Relatórios em PDF
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    Suporte prioritário
                  </li>
                </ul>
              </div>

              {periodEnd && (
                <p className="text-sm text-slate-500">
                  Sua assinatura está paga até{" "}
                  <strong>{new Date(periodEnd).toLocaleDateString("pt-BR")}</strong>.
                  Você pode continuar usando até lá.
                </p>
              )}
            </div>
          )}

          {step === "reason" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Por que você está cancelando? *
                </label>
                <div className="relative">
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    title="Motivo do cancelamento"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecione um motivo</option>
                    {CANCELLATION_REASONS.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <MessageSquare className="w-4 h-4 inline mr-1" />
                  Feedback adicional (opcional)
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="O que poderíamos ter feito melhor?"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cancelImmediately}
                    onChange={(e) => setCancelImmediately(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
                  />
                  <div>
                    <span className="font-medium text-slate-900">
                      Cancelar imediatamente
                    </span>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Se marcado, seu acesso será revogado agora. Caso contrário, 
                      você pode usar até o fim do período pago.
                    </p>
                  </div>
                </label>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}
            </div>
          )}

          {step === "success" && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Assinatura Cancelada
              </h3>
              <p className="text-slate-600">
                {cancelImmediately
                  ? "Seu plano foi alterado para o plano gratuito. Obrigado por usar o Air X Control!"
                  : "Você pode continuar usando o plano PRO até o fim do período pago. Obrigado por usar o Air X Control!"}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-slate-200">
          {step === "confirm" && (
            <>
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
              >
                Manter Assinatura
              </button>
              <button
                onClick={() => setStep("reason")}
                className="flex-1 px-4 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors"
              >
                Continuar Cancelamento
              </button>
            </>
          )}

          {step === "reason" && (
            <>
              <button
                onClick={() => setStep("confirm")}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
              >
                Voltar
              </button>
              <button
                onClick={handleCancel}
                disabled={loading || !reason}
                className="flex-1 px-4 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Cancelando...
                  </>
                ) : (
                  "Confirmar Cancelamento"
                )}
              </button>
            </>
          )}

          {step === "success" && (
            <button
              onClick={handleClose}
              className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
            >
              Fechar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
