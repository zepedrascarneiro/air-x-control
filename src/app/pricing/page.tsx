import Image from "next/image";
import { Check, Star, Plane, Calendar, Receipt, Users, BarChart3, FileText, Zap, Wrench, Shield, Bell, Gauge, Clock, Building2, HeadphonesIcon } from "lucide-react";
import { PLAN_CONFIG } from "@/lib/config";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 0,
});

const freeFeatures = [
  { icon: Plane, text: "1 aeronave" },
  { icon: Calendar, text: "Calendário de reservas" },
  { icon: Receipt, text: "Despesas básicas" },
  { icon: Users, text: "Até 2 usuários" },
  { icon: FileText, text: "Histórico de voos" },
];

const professionalFeatures = [
  { icon: Plane, text: "2 aeronaves incluídas" },
  { icon: Calendar, text: "Calendário + Google Agenda" },
  { icon: Receipt, text: "Centro de custo completo" },
  { icon: Users, text: "Usuários ilimitados" },
  { icon: BarChart3, text: "Dashboard com divisão automática" },
  { icon: FileText, text: "Relatórios em PDF" },
  { icon: Zap, text: "Suporte prioritário" },
];

const enterpriseFeatures = [
  { icon: Plane, text: "Até 5 aeronaves incluídas" },
  { icon: Wrench, text: "Módulo de Manutenção completo" },
  { icon: Clock, text: "Tracking de inspeções e ADs" },
  { icon: Bell, text: "Alertas de vencimento" },
  { icon: Gauge, text: "Controle de Hobbs/Tach" },
  { icon: Shield, text: "Documentação digital" },
  { icon: Building2, text: "Multi-base operacional" },
  { icon: HeadphonesIcon, text: "Gerente de conta dedicado" },
];

export default function PricingPage() {
  const professionalPrice = PLAN_CONFIG.basePlanPrice;
  const enterprisePrice = PLAN_CONFIG.enterprisePlanPrice;
  const addonPrice = PLAN_CONFIG.aircraftAddonPrice;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-3">
              <div className="relative h-10 w-10">
                <Image src="/airx-logo.svg" alt="Air X Control" fill sizes="2.5rem" priority />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-lg font-semibold text-white">Air X</span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-slate-400">Control</span>
              </div>
            </a>
            <nav className="flex items-center gap-4">
              <a href="/demo-dashboard" className="text-sm text-slate-300 hover:text-white transition">Ver Demo</a>
              <a href="/login" className="px-4 py-2 text-sm text-white bg-sky-600 rounded-lg hover:bg-sky-500 transition">Entrar</a>
            </nav>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Planos Air X Control</h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Do piloto solo à frota completa. Comece grátis e evolua conforme sua operação cresce.
        </p>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
          
          {/* PLANO GRATUITO */}
          <div className="relative bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8 hover:border-white/20 transition">
            <div className="mb-6">
              <span className="text-sm uppercase tracking-widest text-emerald-400">Plano Essencial</span>
              <h2 className="text-2xl font-bold text-white mt-2">Para começar</h2>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl font-bold text-emerald-400">Grátis</span>
            </div>
            <p className="text-slate-400 text-sm mb-6">Para sempre, sem cartão</p>
            <p className="text-slate-300 text-sm mb-8">
              Perfeito para pilotos proprietários que querem organizar voos e despesas de forma simples.
            </p>
            <ul className="space-y-3 mb-8">
              {freeFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-slate-200">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <feature.icon className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span className="text-sm">{feature.text}</span>
                </li>
              ))}
            </ul>
            <a href="/register" className="block w-full py-3 text-center bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition font-medium">
              Criar Conta Grátis
            </a>
          </div>

          {/* PLANO PROFISSIONAL */}
          <div className="relative bg-gradient-to-br from-sky-600/20 to-indigo-600/20 backdrop-blur border-2 border-sky-500/50 rounded-3xl p-8 lg:scale-105">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-sky-500 to-indigo-500 text-white text-xs font-semibold rounded-full shadow-lg">
                <Star className="w-3.5 h-3.5" />MAIS POPULAR
              </span>
            </div>
            <div className="mb-6 mt-2">
              <span className="text-sm uppercase tracking-widest text-sky-300">Plano Profissional</span>
              <h2 className="text-2xl font-bold text-white mt-2">Para copropriedades</h2>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl font-bold text-white">{currencyFormatter.format(professionalPrice)}</span>
              <span className="text-sky-200">/mês</span>
            </div>
            <p className="text-sky-200/70 text-sm mb-6">ou R$ 3.970/ano (2 meses grátis)</p>
            <p className="text-sky-100 text-sm mb-8">
              Gestão completa com divisão automática de custos entre coproprietários.
            </p>
            <ul className="space-y-3 mb-8">
              {professionalFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-white">
                  <div className="w-7 h-7 rounded-lg bg-sky-500/30 flex items-center justify-center">
                    <feature.icon className="w-3.5 h-3.5 text-sky-300" />
                  </div>
                  <span className="text-sm">{feature.text}</span>
                </li>
              ))}
            </ul>
            <a href="/demo" className="block w-full py-3 text-center bg-gradient-to-r from-sky-500 to-indigo-500 text-white rounded-xl hover:from-sky-400 hover:to-indigo-400 transition font-medium shadow-lg">
              Começar Agora
            </a>
          </div>

          {/* PLANO ENTERPRISE */}
          <div className="relative bg-gradient-to-br from-amber-600/10 to-orange-600/10 backdrop-blur border border-amber-500/30 rounded-3xl p-8 hover:border-amber-500/50 transition">
            <div className="mb-6">
              <span className="text-sm uppercase tracking-widest text-amber-400">Plano Enterprise</span>
              <h2 className="text-2xl font-bold text-white mt-2">Operação completa</h2>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl font-bold text-amber-400">{currencyFormatter.format(enterprisePrice)}</span>
              <span className="text-amber-200/70">/mês</span>
            </div>
            <p className="text-amber-200/50 text-sm mb-6">ou R$ 6.970/ano (2 meses grátis)</p>
            <p className="text-slate-300 text-sm mb-8">
              Para frotas que precisam de controle total de manutenção e compliance.
            </p>
            <ul className="space-y-3 mb-8">
              {enterpriseFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-slate-200">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <feature.icon className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <span className="text-sm">{feature.text}</span>
                </li>
              ))}
            </ul>
            <a href="/demo" className="block w-full py-3 text-center border-2 border-amber-500/50 text-amber-400 rounded-xl hover:bg-amber-500/10 transition font-medium">
              Falar com Especialista
            </a>
          </div>
        </div>

        {/* Add-on */}
        <div className="max-w-6xl mx-auto mt-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Plane className="w-8 h-8 text-slate-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">Aeronave Adicional</h3>
                <p className="text-sm text-slate-400">Disponível nos planos Profissional e Enterprise</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-white">+ {currencyFormatter.format(addonPrice)}</span>
              <span className="text-slate-400 text-sm">/mês por aeronave</span>
            </div>
          </div>
        </div>

        {/* Tabela Comparativa */}
        <div className="max-w-6xl mx-auto mt-16">
          <h3 className="text-2xl font-bold text-white text-center mb-8">Compare todos os recursos</h3>
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-slate-300 font-medium p-4">Recurso</th>
                  <th className="text-center text-emerald-400 font-medium p-4">Essencial</th>
                  <th className="text-center text-sky-300 font-medium p-4">Profissional</th>
                  <th className="text-center text-amber-400 font-medium p-4">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                <tr><td className="text-slate-200 p-4">Aeronaves incluídas</td><td className="text-center text-slate-300 p-4">1</td><td className="text-center text-white font-semibold p-4">2</td><td className="text-center text-white font-semibold p-4">5</td></tr>
                <tr><td className="text-slate-200 p-4">Usuários</td><td className="text-center text-slate-300 p-4">2</td><td className="text-center text-white p-4">Ilimitados</td><td className="text-center text-white p-4">Ilimitados</td></tr>
                <tr><td className="text-slate-200 p-4">Calendário de reservas</td><td className="text-center p-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td><td className="text-center p-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td><td className="text-center p-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td></tr>
                <tr><td className="text-slate-200 p-4">Integração Google Agenda</td><td className="text-center text-slate-500 p-4">—</td><td className="text-center p-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td><td className="text-center p-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td></tr>
                <tr><td className="text-slate-200 p-4">Registro de despesas</td><td className="text-center p-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td><td className="text-center p-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td><td className="text-center p-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td></tr>
                <tr><td className="text-slate-200 p-4">Divisão automática de custos</td><td className="text-center text-slate-500 p-4">—</td><td className="text-center p-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td><td className="text-center p-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td></tr>
                <tr><td className="text-slate-200 p-4">Dashboard completo</td><td className="text-center text-slate-500 p-4">—</td><td className="text-center p-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td><td className="text-center p-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td></tr>
                <tr><td className="text-slate-200 p-4">Exportar PDF</td><td className="text-center text-slate-500 p-4">—</td><td className="text-center p-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td><td className="text-center p-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td></tr>
                <tr className="bg-amber-500/5"><td className="text-amber-300 p-4 font-medium">🔧 Módulo de Manutenção</td><td className="text-center text-slate-500 p-4">—</td><td className="text-center text-slate-500 p-4">—</td><td className="text-center p-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td></tr>
                <tr className="bg-amber-500/5"><td className="text-amber-300 p-4 font-medium">📋 Tracking de Inspeções</td><td className="text-center text-slate-500 p-4">—</td><td className="text-center text-slate-500 p-4">—</td><td className="text-center p-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td></tr>
                <tr className="bg-amber-500/5"><td className="text-amber-300 p-4 font-medium">⏰ Alertas de Vencimento</td><td className="text-center text-slate-500 p-4">—</td><td className="text-center text-slate-500 p-4">—</td><td className="text-center p-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td></tr>
                <tr className="bg-amber-500/5"><td className="text-amber-300 p-4 font-medium">📊 Controle Hobbs/Tach</td><td className="text-center text-slate-500 p-4">—</td><td className="text-center text-slate-500 p-4">—</td><td className="text-center p-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td></tr>
                <tr className="bg-amber-500/5"><td className="text-amber-300 p-4 font-medium">📁 Documentação Digital</td><td className="text-center text-slate-500 p-4">—</td><td className="text-center text-slate-500 p-4">—</td><td className="text-center p-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td></tr>
                <tr className="bg-amber-500/5"><td className="text-amber-300 p-4 font-medium">🏢 Multi-base</td><td className="text-center text-slate-500 p-4">—</td><td className="text-center text-slate-500 p-4">—</td><td className="text-center p-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td></tr>
                <tr><td className="text-slate-200 p-4">Suporte</td><td className="text-center text-slate-300 p-4">Email</td><td className="text-center text-white p-4">Prioritário</td><td className="text-center text-amber-400 font-semibold p-4">Dedicado</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-3xl mx-auto mt-16 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Comece grátis, evolua quando precisar</h3>
          <p className="text-slate-300 mb-8">Crie sua conta gratuita agora e comece a organizar seus voos. Sem compromisso, sem cartão de crédito.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register" className="px-8 py-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition font-semibold">
              Criar Conta Grátis
            </a>
            <a href="/demo" className="px-8 py-4 border border-white/20 text-white rounded-xl hover:bg-white/5 transition font-semibold">
              Ver Demonstração
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} Air X Control. Todos os direitos reservados.</p>
        </div>
      </footer>
    </main>
  );
}
