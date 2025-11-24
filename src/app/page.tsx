import Image from "next/image";
import Link from "next/link";

import { DemoForm } from "@/components/demo-form";
import { LogoutButton } from "@/components/logout-button";
import { getCurrentUser } from "@/lib/auth";

export default async function Home() {
  const user = await getCurrentUser();
  const firstName = user?.name.split(" ")[0] ?? null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-air-blue-900 via-air-blue-700 to-air-blue-500">
      <header className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3" aria-label="Air X Control">
                <div className="relative h-12 w-12 sm:h-14 sm:w-14">
                  <Image
                    src="/airx-logo.svg"
                    alt="Logotipo Air X Control"
                    fill
                    sizes="(max-width: 640px) 3rem, 3.5rem"
                    priority
                  />
                </div>
                <div className="hidden sm:flex sm:flex-col sm:leading-tight">
                  <span className="text-lg font-semibold text-white">Air X</span>
                  <span className="text-xs uppercase tracking-[0.35em] text-air-blue-200">
                    Control
                  </span>
                </div>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <span className="hidden text-air-blue-100 md:inline">
                    Olá, {firstName ?? user.name}!
                  </span>
                  <Link
                    href="/dashboard"
                    className="rounded-lg border border-white/20 px-4 py-2 font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/10"
                  >
                    Meu painel
                  </Link>
                  <LogoutButton
                    label="Sair"
                    variant="ghost"
                    className="flex-row items-center gap-2"
                  />
                </>
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    className="text-white transition-colors hover:text-air-gold-300"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/login"
                    className="text-white transition-colors hover:text-air-gold-300"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-lg bg-air-gold-400 px-4 py-2 font-semibold text-air-blue-900 transition-colors hover:bg-air-gold-300"
                  >
                    Cadastrar
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-5xl font-bold text-white md:text-6xl">
            Gestão Inteligente de
            <span className="block text-air-gold-400">Aeronaves</span>
          </h2>
          <p className="mb-8 text-xl leading-relaxed text-air-blue-100">
            Controle completo do compartilhamento de aeronaves com dashboards intuitivos,
            agenda integrada e gestão financeira avançada. Plano base inclui até duas aeronaves por
            {" "}
            <span className="font-semibold text-air-gold-200">R$ 397/mês</span>
            {" "}
            e permite adicionar novos prefixos e coproprietários por
            {" "}
            <span className="font-semibold text-air-gold-200">+ R$ 97</span>
            {" "}
            cada.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/dashboard"
              className="rounded-lg border-2 border-white px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white hover:text-air-blue-900"
            >
              Ver Dashboard
            </Link>
            <Link
              href="/demo"
              className="transform rounded-lg bg-air-gold-400 px-8 py-4 text-lg font-semibold text-air-blue-900 transition-all hover:scale-105 hover:bg-air-gold-300"
            >
              Ver Demonstração
            </Link>
            <Link
              href="/pricing"
              className="rounded-lg border-2 border-white px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white hover:text-air-blue-900"
            >
              Ver Planos
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto grid gap-8 px-4 py-20 md:grid-cols-3">
        <div className="rounded-xl bg-white/10 p-8 text-white backdrop-blur-lg">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-air-gold-400">
            <span className="text-2xl text-air-blue-900">📊</span>
          </div>
          <h3 className="mb-3 text-xl font-semibold">Dashboards Intuitivos</h3>
          <p className="text-air-blue-100">
            Visualize horas de voo, custos operacionais e previsões financeiras em tempo real.
          </p>
        </div>

        <div className="rounded-xl bg-white/10 p-8 text-white backdrop-blur-lg">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-air-gold-400">
            <span className="text-2xl text-air-blue-900">📅</span>
          </div>
          <h3 className="mb-3 text-xl font-semibold">Agenda Compartilhada</h3>
          <p className="text-air-blue-100">
            Sincronização completa com Google Calendar e gestão de reservas inteligente.
          </p>
        </div>

        <div className="rounded-xl bg-white/10 p-8 text-white backdrop-blur-lg">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-air-gold-400">
            <span className="text-2xl text-air-blue-900">🔐</span>
          </div>
          <h3 className="mb-3 text-xl font-semibold">Controle de Acesso</h3>
            <p className="text-air-blue-100">
              Níveis diferenciados: Administrador/Comandante com poder de edição e Proprietário/Passageiro para consultas estratégicas.
            </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="rounded-2xl bg-white/10 p-12 backdrop-blur-lg">
          <h3 className="mb-12 text-center text-3xl font-bold text-white">
            Controle Completo da Sua Frota
          </h3>
          <div className="grid gap-8 text-center md:grid-cols-4">
            <div>
              <div className="mb-2 text-4xl font-bold text-air-gold-400">100%</div>
              <div className="text-white">Controle de Horas</div>
            </div>
            <div>
              <div className="mb-2 text-4xl font-bold text-air-gold-400">24/7</div>
              <div className="text-white">Acesso Online</div>
            </div>
            <div>
              <div className="mb-2 text-4xl font-bold text-air-gold-400">Real Time</div>
              <div className="text-white">Dados em Tempo Real</div>
            </div>
            <div>
              <div className="mb-2 text-4xl font-bold text-air-gold-400">∞</div>
              <div className="text-white">Aeronaves</div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <div className="rounded-3xl border border-white/10 bg-air-blue-900/40 p-10 shadow-xl backdrop-blur-lg">
          <div className="mx-auto flex max-w-5xl flex-col gap-10 md:flex-row md:items-start">
            <div className="md:w-1/2">
              <h3 className="text-4xl font-bold text-white">Pronto para ver o Air X em ação?</h3>
              <p className="mt-4 text-lg text-air-blue-100">
                Agende uma sessão exclusiva com nossos especialistas para conhecer os dashboards,
                fluxos de reserva e o controle financeiro completo que preparamos para sua operação.
              </p>
              <ul className="mt-6 space-y-3 text-air-blue-100">
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-air-gold-400">◆</span>
                  <span>Visão completa da gestão de aeronaves, horas de voo e saldo de utilização.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-air-gold-400">◆</span>
                  <span>Simulações de custos e absorções baseadas no seu perfil de operação.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-air-gold-400">◆</span>
                  <span>Roadmap exclusivo com integrações e automações recomendadas.</span>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2">
              <DemoForm />
            </div>
          </div>
        </div>
      </section>

      <footer className="container mx-auto px-4 py-12 text-center text-air-blue-100">
        <p>&copy; 2025 Air X - Sistema de Gestão de Aeronaves</p>
        <p className="mt-2">Desenvolvido com tecnologia de ponta para aviação moderna</p>
      </footer>
    </main>
  );
}
