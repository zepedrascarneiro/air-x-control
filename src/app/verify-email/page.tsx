"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Plane, CheckCircle, XCircle, Loader2, Mail } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [status, setStatus] = useState<"loading" | "success" | "error" | "no-token">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("no-token");
      return;
    }

    async function verifyEmail() {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await res.json();

        if (res.ok && data.verified) {
          setStatus("success");
          setMessage("Seu email foi verificado com sucesso!");
        } else {
          setStatus("error");
          setMessage(data.message || "Erro ao verificar email");
        }
      } catch {
        setStatus("error");
        setMessage("Erro ao conectar com o servidor");
      }
    }

    verifyEmail();
  }, [token]);

  return (
    <>
      {status === "loading" && (
        <>
          <Loader2 className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Verificando email...
          </h2>
          <p className="text-blue-200">Aguarde um momento</p>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Email Verificado! ✅
          </h2>
          <p className="text-blue-200 mb-6">{message}</p>
          <Link
            href="/dashboard"
            className="inline-block w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors"
          >
            Ir para o Dashboard
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Erro na Verificação
          </h2>
          <p className="text-red-300 mb-6">{message}</p>
          <Link
            href="/login"
            className="inline-block w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
          >
            Ir para Login
          </Link>
        </>
      )}

      {status === "no-token" && (
        <>
          <Mail className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Verificação de Email
          </h2>
          <p className="text-blue-200 mb-6">
            Acesse o link enviado para seu email para verificar sua conta.
          </p>
          <Link
            href="/login"
            className="inline-block w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
          >
            Ir para Login
          </Link>
        </>
      )}
    </>
  );
}

function LoadingFallback() {
  return (
    <>
      <Loader2 className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-spin" />
      <h2 className="text-xl font-semibold text-white mb-2">
        Carregando...
      </h2>
    </>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Plane className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Air X Control</h1>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
          <Suspense fallback={<LoadingFallback />}>
            <VerifyEmailContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
