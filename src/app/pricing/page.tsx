import Image from "next/image";

import { PLAN_CONFIG, calculateMonthlyFee } from "@/lib/config";

const basePrice = PLAN_CONFIG.basePlanPrice;
const includedAircraft = PLAN_CONFIG.baseAircraftIncluded;
const addonPrice = PLAN_CONFIG.aircraftAddonPrice;
const threeAircraftPrice = calculateMonthlyFee(includedAircraft + 1);
const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

const includedFeatures = [
  "Até duas aeronaves com dashboards mensais ilimitados",
  "Gestão completa de voos, despesas e centro de custo",
  "Troca de coproprietários e tripulação incluída",
  "Suporte premium para implantação de processos",
];

const addonFeatures = [
  "Habilite uma nova aeronave a qualquer momento",
  "Inclui slot extra para coproprietários alternativos",
  "Dashboards e relatórios automáticos para a frota ampliada",
  `Valor total com três aeronaves: ${currencyFormatter.format(threeAircraftPrice)}`,
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-air-blue-900 via-air-blue-700 to-air-blue-500 py-20">
      <section className="container mx-auto px-4 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto mb-10 flex w-fit items-center gap-4 text-left">
            <div className="relative h-14 w-14">
              <Image
                src="/airx-logo.svg"
                alt="Logotipo Air X Control"
                fill
                sizes="3.5rem"
                priority
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-2xl font-semibold text-white">Air X</span>
              <span className="text-xs uppercase tracking-[0.35em] text-air-blue-200">
                Control
              </span>
            </div>
          </div>

          <header className="text-center">
            <h1 className="text-4xl font-bold">Planos Air X Control</h1>
            <p className="mt-4 text-lg text-air-blue-100">
              Estrutura pensada para operações compartilhadas: controle total das horas, finanças e
              coproprietários com base mensal fixa e expansão sob demanda.
            </p>
          </header>

          <div className="mt-12 grid gap-6 md:grid-cols-[2fr,1.2fr]">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-10 backdrop-blur">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <span className="text-sm uppercase tracking-[0.3em] text-air-blue-200">
                    Assinatura Base
                  </span>
                  <h2 className="mt-2 text-3xl font-semibold text-white">
                    {includedAircraft} aeronaves
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-sm text-air-blue-200">mensalidade</span>
                  <p className="text-4xl font-bold text-air-gold-300">
                    {currencyFormatter.format(basePrice)}
                  </p>
                </div>
              </div>

              <p className="mt-6 text-air-blue-100">
                Cobertura completa para toda a operação: cadastre voos, gere relatórios mensais e
                controle custos com dois prefixos simultâneos e coproprietários flexíveis.
              </p>

              <ul className="mt-8 space-y-3 text-sm text-air-blue-100">
                {includedFeatures.map((item) => (
                  <li key={item} className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
                    <span className="mt-1 text-air-gold-300">◆</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-air-blue-100">
                  Inclui dashboards com divisão mensal automática e filtros por período para auditorias
                  e prestação de contas personalizada.
                </p>
                <a
                  href="/demo"
                  className="rounded-lg bg-air-gold-400 px-6 py-3 text-sm font-semibold text-air-blue-900 transition hover:bg-air-gold-300"
                >
                  Agendar demonstração
                </a>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-air-gold-300/40 bg-air-gold-100/10 p-8 text-air-blue-100">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-xl font-semibold text-white">Add-on de Aeronave</h3>
                  <span className="text-2xl font-semibold text-air-gold-300">
                    +
                    {" "}
                    {currencyFormatter.format(addonPrice)}
                  </span>
                </div>
                <p className="mt-4">
                  Libere um novo prefixo quando precisar. O complemento habilita a troca de
                  coproprietários e mantém todos os relatórios mensais sincronizados.
                </p>
                <ul className="mt-6 space-y-3 text-sm">
                  {addonFeatures.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 text-air-gold-300">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/10 p-8 text-sm text-air-blue-100 backdrop-blur">
                <h4 className="text-lg font-semibold text-white">Quer outro formato?</h4>
                <p className="mt-2">
                  Criamos configurações especiais para operações com mais de duas aeronaves ou com
                  divisão de gestão diferenciada. Nossa equipe auxilia na implantação financeira e
                  jurídica.
                </p>
                <a
                  href="/demo"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-white/20 px-4 py-2 font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
                >
                  Falar com especialista
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
