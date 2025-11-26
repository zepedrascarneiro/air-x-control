"use client";

import Link from "next/link";
import { Plane, ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link 
            href="/"
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-slate-800">Air X Control</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Termos de Uso
        </h1>
        <p className="text-slate-500 mb-8">
          Última atualização: 26 de novembro de 2025
        </p>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              1. Aceitação dos Termos
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Ao acessar e usar o Air X Control (&ldquo;Serviço&rdquo;), você concorda em cumprir e 
              ficar vinculado a estes Termos de Uso. Se você não concordar com qualquer 
              parte destes termos, não poderá acessar o Serviço.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              2. Descrição do Serviço
            </h2>
            <p className="text-slate-600 leading-relaxed">
              O Air X Control é uma plataforma de gestão para aviação compartilhada que permite:
            </p>
            <ul className="list-disc list-inside text-slate-600 mt-3 space-y-2">
              <li>Registro e acompanhamento de voos</li>
              <li>Controle de despesas e rateio entre proprietários</li>
              <li>Agendamento e reserva de aeronaves</li>
              <li>Gestão de múltiplos usuários por organização</li>
              <li>Relatórios e análises operacionais</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              3. Cadastro e Conta
            </h2>
            <p className="text-slate-600 leading-relaxed mb-3">
              Para usar o Serviço, você deve criar uma conta fornecendo informações 
              precisas e completas. Você é responsável por:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2">
              <li>Manter a confidencialidade de sua senha</li>
              <li>Todas as atividades que ocorram em sua conta</li>
              <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              4. Uso Aceitável
            </h2>
            <p className="text-slate-600 leading-relaxed mb-3">
              Você concorda em não usar o Serviço para:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2">
              <li>Violar qualquer lei ou regulamento aplicável</li>
              <li>Transmitir vírus ou código malicioso</li>
              <li>Interferir na operação do Serviço</li>
              <li>Coletar dados de outros usuários sem autorização</li>
              <li>Realizar atividades fraudulentas</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              5. Propriedade Intelectual
            </h2>
            <p className="text-slate-600 leading-relaxed">
              O Serviço e seu conteúdo original, recursos e funcionalidades são e 
              permanecerão propriedade exclusiva do Air X Control. O Serviço é 
              protegido por direitos autorais, marcas registradas e outras leis.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              6. Dados e Privacidade
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Sua privacidade é importante para nós. Nossa{" "}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Política de Privacidade
              </Link>{" "}
              descreve como coletamos, usamos e protegemos suas informações pessoais.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              7. Limitação de Responsabilidade
            </h2>
            <p className="text-slate-600 leading-relaxed">
              O Air X Control é fornecido &ldquo;como está&rdquo; e &ldquo;conforme disponível&rdquo;. 
              Não garantimos que o Serviço será ininterrupto, seguro ou livre de erros. 
              Em nenhum caso seremos responsáveis por danos indiretos, incidentais, 
              especiais ou consequenciais.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              8. Planos e Pagamentos
            </h2>
            <p className="text-slate-600 leading-relaxed mb-3">
              O Air X Control oferece diferentes planos de assinatura:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2">
              <li>Os preços são exibidos na página de preços</li>
              <li>Cobranças são recorrentes conforme o ciclo escolhido</li>
              <li>Você pode cancelar sua assinatura a qualquer momento</li>
              <li>Reembolsos são tratados conforme nossa política</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              9. Modificações
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Reservamo-nos o direito de modificar ou substituir estes Termos a 
              qualquer momento. Se uma revisão for significativa, forneceremos 
              aviso prévio de pelo menos 30 dias antes que os novos termos entrem 
              em vigor.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              10. Contato
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Se você tiver dúvidas sobre estes Termos, entre em contato conosco em:{" "}
              <a 
                href="mailto:contato@airxcontrol.com" 
                className="text-blue-600 hover:underline"
              >
                contato@airxcontrol.com
              </a>
            </p>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center text-sm">
          <Link href="/privacy" className="text-blue-600 hover:underline">
            Política de Privacidade
          </Link>
          <span className="text-slate-300">•</span>
          <Link href="/faq" className="text-blue-600 hover:underline">
            Perguntas Frequentes
          </Link>
          <span className="text-slate-300">•</span>
          <Link href="/" className="text-blue-600 hover:underline">
            Voltar ao Início
          </Link>
        </div>
      </main>
    </div>
  );
}
