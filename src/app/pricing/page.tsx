"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Check, Star, Plane, Loader2, CheckCircle, XCircle } from "lucide-react";
import { PLAN_CONFIG } from "@/lib/config";
import { Suspense } from "react";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 0,
});

function PricingContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<string | null>(null);
  
  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");

  const professionalPrice = PLAN_CONFIG.basePlanPrice;
  const enterprisePrice = PLAN_CONFIG.enterprisePlanPrice;
  const addonPrice = PLAN_CONFIG.aircraftAddonPrice;

  const handleSubscribe = async (plan: string) => {
    setLoading(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Erro ao processar");
        setLoading(null);
      }
    } catch {
      alert("Erro ao processar. Tente novamente.");
      setLoading(null);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-3">
              <div className="relative h-10 w-10">
                <Image src="/airx-logo.svg" alt="Air X Control" fill sizes="2.5rem" priority />
              </div>
              <span className="text-lg font-semibold text-white">Air X Control</span>
            </a>
            <nav className="flex items-center gap-4">
              <a href="/login" className="px-4 py-2 text-sm text-white bg-sky-600 rounded-lg hover:bg-sky-500 transition">Entrar</a>
            </nav>
          </div>
        </div>
      </header>

      {success && (
        <div className="container mx-auto px-4 pt-8">
          <div className="max-w-2xl mx-auto bg-green-500/20 border border-green-500/50 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <p className="text-green-200 font-medium">Assinatura realizada com sucesso!</p>
          </div>
        </div>
      )}

      {canceled && (
        <div className="container mx-auto px-4 pt-8">
          <div className="max-w-2xl mx-auto bg-amber-500/20 border border-amber-500/50 rounded-xl p-4 flex items-center gap-3">
            <XCircle className="w-6 h-6 text-amber-400" />
            <p className="text-amber-200 font-medium">Checkout cancelado</p>
          </div>
        </div>
      )}

      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Planos Air X Control</h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Comece grátis e evolua conforme sua operação cresce.
        </p>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
          
          {/* FREE */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <span className="text-sm uppercase tracking-widest text-emerald-400">Essencial</span>
            <h2 className="text-2xl font-bold text-white mt-2">Para começar</h2>
            <div className="mt-4 mb-6">
              <span className="text-5xl font-bold text-emerald-400">Grátis</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-slate-200"><Check className="w-4 h-4 text-emerald-400" /> 1 aeronave</li>
              <li className="flex items-center gap-2 text-slate-200"><Check className="w-4 h-4 text-emerald-400" /> 2 usuários</li>
              <li className="flex items-center gap-2 text-slate-200"><Check className="w-4 h-4 text-emerald-400" /> Dashboard básico</li>
            </ul>
            <a href="/register" className="block w-full py-3 text-center bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition font-medium">
              Criar Conta Grátis
            </a>
          </div>

          {/* PRO */}
          <div className="relative bg-gradient-to-br from-sky-600/20 to-indigo-600/20 border-2 border-sky-500/50 rounded-3xl p-8 lg:scale-105">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-sky-500 to-indigo-500 text-white text-xs font-semibold rounded-full">
                <Star className="w-3.5 h-3.5" />POPULAR
              </span>
            </div>
            <span className="text-sm uppercase tracking-widest text-sky-300">Profissional</span>
            <h2 className="text-2xl font-bold text-white mt-2">Para copropriedades</h2>
            <div className="mt-4 mb-6">
              <span className="text-5xl font-bold text-white">{currencyFormatter.format(professionalPrice)}</span>
              <span className="text-sky-200">/mês</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-white"><Check className="w-4 h-4 text-sky-300" /> 3 aeronaves</li>
              <li className="flex items-center gap-2 text-white"><Check className="w-4 h-4 text-sky-300" /> Usuários ilimitados</li>
              <li className="flex items-center gap-2 text-white"><Check className="w-4 h-4 text-sky-300" /> Dashboard completo</li>
              <li className="flex items-center gap-2 text-white"><Check className="w-4 h-4 text-sky-300" /> Relatórios em PDF</li>
            </ul>
            <button 
              onClick={() => handleSubscribe("PRO")}
              disabled={loading === "PRO"}
              className="block w-full py-3 text-center bg-gradient-to-r from-sky-500 to-indigo-500 text-white rounded-xl font-medium disabled:opacity-50"
            >
              {loading === "PRO" ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Assinar Agora"}
            </button>
          </div>

          {/* ENTERPRISE */}
          <div className="bg-gradient-to-br from-amber-600/10 to-orange-600/10 border border-amber-500/30 rounded-3xl p-8">
            <span className="text-sm uppercase tracking-widest text-amber-400">Enterprise</span>
            <h2 className="text-2xl font-bold text-white mt-2">Operação completa</h2>
            <div className="mt-4 mb-6">
              <span className="text-5xl font-bold text-amber-400">{currencyFormatter.format(enterprisePrice)}</span>
              <span className="text-amber-200/70">/mês</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-slate-200"><Check className="w-4 h-4 text-amber-400" /> Aeronaves ilimitadas</li>
              <li className="flex items-center gap-2 text-slate-200"><Check className="w-4 h-4 text-amber-400" /> Módulo de Manutenção</li>
              <li className="flex items-center gap-2 text-slate-200"><Check className="w-4 h-4 text-amber-400" /> Suporte dedicado</li>
            </ul>
            <button 
              onClick={() => handleSubscribe("ENTERPRISE")}
              disabled={loading === "ENTERPRISE"}
              className="block w-full py-3 text-center border-2 border-amber-500/50 text-amber-400 rounded-xl font-medium disabled:opacity-50"
            >
              {loading === "ENTERPRISE" ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Assinar Enterprise"}
            </button>
          </div>
        </div>

        {/* Add-on */}
        <div className="max-w-6xl mx-auto mt-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Plane className="w-8 h-8 text-slate-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">Aeronave Adicional</h3>
                <p className="text-sm text-slate-400">Disponível nos planos pagos</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-white">+ {currencyFormatter.format(addonPrice)}/mês</span>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} Air X Control</p>
        </div>
      </footer>
    </main>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center"><Loader2 className="w-8 h-8 text-white animate-spin" /></div>}>
      <PricingContent />
    </Suspense>
  );
}
