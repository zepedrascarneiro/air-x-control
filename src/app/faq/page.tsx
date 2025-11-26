"use client";

import { useState } from "react";
import Link from "next/link";
import { Plane, ArrowLeft, ChevronDown, Search, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // Geral
  {
    category: "Geral",
    question: "O que é o Air X Control?",
    answer: "O Air X Control é uma plataforma de gestão para aviação compartilhada. Permite que proprietários de aeronaves registrem voos, controlem despesas, façam rateios entre sócios e gerenciem reservas de forma simples e organizada."
  },
  {
    category: "Geral",
    question: "Para quem é indicado o Air X Control?",
    answer: "É ideal para grupos de proprietários que compartilham aeronaves, aeroclubes, empresas de táxi aéreo e qualquer operação que precise gerenciar múltiplos usuários e rateio de custos."
  },
  {
    category: "Geral",
    question: "Posso usar no celular?",
    answer: "Sim! O Air X Control é um Progressive Web App (PWA). Você pode instalar no seu celular como um aplicativo nativo, com acesso rápido e interface otimizada para mobile."
  },
  // Conta
  {
    category: "Conta",
    question: "Como criar uma conta?",
    answer: "Clique em 'Começar Agora' na página inicial, preencha seus dados e crie sua organização. Você receberá um código de compartilhamento para convidar outros membros."
  },
  {
    category: "Conta",
    question: "Esqueci minha senha, o que fazer?",
    answer: "Na tela de login, clique em 'Esqueci minha senha'. Digite seu email e você receberá um link para criar uma nova senha. O link expira em 1 hora."
  },
  {
    category: "Conta",
    question: "Como adicionar outros membros?",
    answer: "Acesse Configurações e copie o código de compartilhamento da sua organização (formato AIRX-XXXX). Envie para os novos membros, que poderão se cadastrar usando esse código."
  },
  {
    category: "Conta",
    question: "Quais são os papéis de usuário?",
    answer: "Existem dois papéis: OWNER (administrador) pode gerenciar membros e configurações; MEMBER pode registrar voos, despesas e fazer reservas. O criador da organização é automaticamente OWNER."
  },
  // Funcionalidades
  {
    category: "Funcionalidades",
    question: "Como registrar um voo?",
    answer: "No Dashboard, clique no botão '+' ou 'Novo Voo'. Preencha os dados como data, aeronave, horas de voo, combustível e observações. O sistema calculará automaticamente os valores."
  },
  {
    category: "Funcionalidades",
    question: "Como funciona o rateio de despesas?",
    answer: "As despesas podem ser rateadas proporcionalmente entre os sócios com base nas horas voadas ou divididas igualmente. O Dashboard mostra automaticamente o saldo de cada proprietário."
  },
  {
    category: "Funcionalidades",
    question: "Posso reservar a aeronave com antecedência?",
    answer: "Sim! O Calendário permite fazer reservas futuras. Basta selecionar a data, horário e aeronave. Outros membros verão a reserva e evitarão conflitos."
  },
  {
    category: "Funcionalidades",
    question: "Como cadastrar despesas?",
    answer: "Você pode adicionar despesas fixas (hangar, seguro) ou variáveis (combustível, manutenção). Cada despesa pode ser associada a uma aeronave específica e será rateada entre os sócios."
  },
  // Planos
  {
    category: "Planos",
    question: "Quais planos estão disponíveis?",
    answer: "Oferecemos planos Básico, Profissional e Enterprise. Cada um tem limites diferentes de aeronaves, usuários e funcionalidades. Consulte a página de Preços para detalhes."
  },
  {
    category: "Planos",
    question: "Posso testar antes de assinar?",
    answer: "Sim! Oferecemos um período de teste gratuito para você conhecer todas as funcionalidades antes de escolher um plano."
  },
  {
    category: "Planos",
    question: "Como funciona o pagamento?",
    answer: "Aceitamos cartão de crédito e PIX. A cobrança é recorrente (mensal ou anual) e você pode cancelar a qualquer momento."
  },
  {
    category: "Planos",
    question: "Posso mudar de plano?",
    answer: "Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento. A diferença de valor será ajustada na próxima cobrança."
  },
  // Suporte
  {
    category: "Suporte",
    question: "Como entrar em contato com o suporte?",
    answer: "Você pode nos contatar pelo email contato@airxcontrol.com. Respondemos em até 24 horas úteis."
  },
  {
    category: "Suporte",
    question: "Vocês oferecem treinamento?",
    answer: "Sim! Para planos Enterprise, oferecemos treinamento personalizado. Para outros planos, disponibilizamos tutoriais em vídeo e documentação completa."
  },
  {
    category: "Suporte",
    question: "Meus dados estão seguros?",
    answer: "Absolutamente! Utilizamos criptografia de ponta a ponta, backups diários e seguimos as melhores práticas de segurança. Consulte nossa Política de Privacidade para mais detalhes."
  },
];

const categories = ["Todos", "Geral", "Conta", "Funcionalidades", "Planos", "Suporte"];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filteredFAQ = faqData.filter((item) => {
    const matchesSearch = 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <HelpCircle className="w-12 h-12 text-white/80 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">
            Como podemos ajudar?
          </h1>
          <p className="text-blue-100 mb-6">
            Encontre respostas para as perguntas mais frequentes
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar pergunta..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {filteredFAQ.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <p className="text-slate-500">
                Nenhuma pergunta encontrada. Tente uma busca diferente.
              </p>
            </div>
          ) : (
            filteredFAQ.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {item.category}
                    </span>
                    <span className="font-medium text-slate-800">
                      {item.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-4">
                    <p className="text-slate-600 leading-relaxed pl-16">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-2">
            Não encontrou o que procurava?
          </h2>
          <p className="text-blue-100 mb-6">
            Nossa equipe está pronta para ajudar
          </p>
          <a
            href="mailto:contato@airxcontrol.com"
            className="inline-block px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
          >
            Falar com Suporte
          </a>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center text-sm">
          <Link href="/terms" className="text-blue-600 hover:underline">
            Termos de Uso
          </Link>
          <span className="text-slate-300">•</span>
          <Link href="/privacy" className="text-blue-600 hover:underline">
            Política de Privacidade
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
