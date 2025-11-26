"use client";

import Link from "next/link";
import { Plane, ArrowLeft, Shield, Database, Eye, Lock, Bell, Trash2 } from "lucide-react";

export default function PrivacyPage() {
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
          Política de Privacidade
        </h1>
        <p className="text-slate-500 mb-8">
          Última atualização: 26 de novembro de 2025
        </p>

        {/* Summary Cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-start gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Dados Protegidos</h3>
              <p className="text-sm text-slate-500">Criptografia em trânsito e em repouso</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Transparência</h3>
              <p className="text-sm text-slate-500">Você sabe o que coletamos</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-start gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Lock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Seu Controle</h3>
              <p className="text-sm text-slate-500">Exporte ou delete seus dados</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              1. Dados que Coletamos
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Coletamos apenas os dados necessários para fornecer o Serviço:
            </p>
            
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-800 mb-2">Dados de Conta</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Nome completo e email</li>
                  <li>• Senha (criptografada)</li>
                  <li>• Organização/empresa</li>
                </ul>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-800 mb-2">Dados Operacionais</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Registros de voos (data, horas, combustível)</li>
                  <li>• Despesas e rateios</li>
                  <li>• Reservas e agendamentos</li>
                  <li>• Dados de aeronaves</li>
                </ul>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-800 mb-2">Dados Técnicos</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Endereço IP e tipo de navegador</li>
                  <li>• Logs de acesso e uso</li>
                  <li>• Cookies essenciais</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              2. Como Usamos seus Dados
            </h2>
            <ul className="space-y-3 text-slate-600">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">1</span>
                <span><strong>Fornecer o Serviço:</strong> Processar voos, calcular rateios, gerar relatórios</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">2</span>
                <span><strong>Comunicação:</strong> Enviar notificações, alertas e atualizações importantes</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">3</span>
                <span><strong>Melhorias:</strong> Entender como você usa o Serviço para melhorá-lo</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">4</span>
                <span><strong>Segurança:</strong> Detectar e prevenir fraudes e abusos</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              3. Proteção dos Dados
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Implementamos medidas de segurança robustas:
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
                ✓ Criptografia TLS em todas as conexões
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
                ✓ Senhas com hash bcrypt
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
                ✓ Backups criptografados diários
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
                ✓ Monitoramento 24/7
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              4. Compartilhamento de Dados
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              <strong>Não vendemos seus dados.</strong> Compartilhamos apenas quando:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2">
              <li>Você autoriza explicitamente (ex: compartilhar com sócios)</li>
              <li>Necessário para fornecer o Serviço (provedores de pagamento)</li>
              <li>Exigido por lei ou ordem judicial</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" />
              5. Seus Direitos (LGPD)
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Conforme a Lei Geral de Proteção de Dados, você tem direito a:
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <span className="text-lg">📋</span>
                <span className="text-slate-700"><strong>Acesso:</strong> Saber quais dados temos sobre você</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <span className="text-lg">✏️</span>
                <span className="text-slate-700"><strong>Correção:</strong> Corrigir dados incorretos</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <span className="text-lg">📤</span>
                <span className="text-slate-700"><strong>Portabilidade:</strong> Exportar seus dados</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <span className="text-lg">🗑️</span>
                <span className="text-slate-700"><strong>Exclusão:</strong> Deletar sua conta e dados</span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-blue-600" />
              6. Retenção de Dados
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Mantemos seus dados enquanto sua conta estiver ativa. Após exclusão da conta, 
              os dados são removidos em até 30 dias, exceto quando necessário para:
            </p>
            <ul className="list-disc list-inside text-slate-600 mt-3 space-y-1">
              <li>Cumprir obrigações legais</li>
              <li>Resolver disputas</li>
              <li>Fazer valer nossos acordos</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              7. Contato
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Para exercer seus direitos ou esclarecer dúvidas sobre privacidade:
            </p>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800">
                <strong>Email:</strong>{" "}
                <a href="mailto:privacidade@airxcontrol.com" className="underline">
                  privacidade@airxcontrol.com
                </a>
              </p>
            </div>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center text-sm">
          <Link href="/terms" className="text-blue-600 hover:underline">
            Termos de Uso
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
