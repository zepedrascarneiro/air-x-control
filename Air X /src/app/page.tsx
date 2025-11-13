import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-air-blue-900 via-air-blue-700 to-air-blue-500">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-air-gold-400 rounded-lg flex items-center justify-center">
                <span className="text-air-blue-900 font-bold text-xl">AX</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Air X</h1>
            </div>
            <div className="space-x-4">
              <Link 
                href="/login" 
                className="text-white hover:text-air-gold-300 transition-colors"
              >
                Login
              </Link>
              <Link 
                href="/register" 
                className="bg-air-gold-400 text-air-blue-900 px-4 py-2 rounded-lg font-semibold hover:bg-air-gold-300 transition-colors"
              >
                Cadastrar
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Gestão Inteligente de
            <span className="text-air-gold-400 block">Cotas de Aeronaves</span>
          </h2>
          <p className="text-xl text-air-blue-100 mb-8 leading-relaxed">
            Controle completo das suas cotas compartilhadas com dashboards intuitivos, 
            agenda integrada e gestão financeira avançada.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/demo"
              className="bg-air-gold-400 text-air-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-air-gold-300 transition-all transform hover:scale-105"
            >
              Ver Demonstração
            </Link>
            <Link 
              href="/pricing"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-air-blue-900 transition-all"
            >
              Ver Planos
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-white">
            <div className="w-12 h-12 bg-air-gold-400 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-air-blue-900 text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Dashboards Intuitivos</h3>
            <p className="text-air-blue-100">
              Visualize horas de voo, custos operacionais e previsões financeiras em tempo real.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-white">
            <div className="w-12 h-12 bg-air-gold-400 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-air-blue-900 text-2xl">📅</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Agenda Compartilhada</h3>
            <p className="text-air-blue-100">
              Sincronização completa com Google Calendar e gestão de reservas inteligente.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-white">
            <div className="w-12 h-12 bg-air-gold-400 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-air-blue-900 text-2xl">🔐</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Controle de Acesso</h3>
            <p className="text-air-blue-100">
              Níveis diferenciados: Administrador/Comandante com poder de edição e Proprietário/Passageiro voltado a consultas.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Controle Completo da Sua Frota
          </h3>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-air-gold-400 mb-2">100%</div>
              <div className="text-white">Controle de Horas</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-air-gold-400 mb-2">24/7</div>
              <div className="text-white">Acesso Online</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-air-gold-400 mb-2">Real Time</div>
              <div className="text-white">Dados em Tempo Real</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-air-gold-400 mb-2">∞</div>
              <div className="text-white">Aeronaves</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 text-center">
        <div className="text-air-blue-100">
          <p>&copy; 2025 Air X - Sistema de Gestão de Cotas de Aeronaves</p>
          <p className="mt-2">Desenvolvido com tecnologia de ponta para aviação moderna</p>
        </div>
      </footer>
    </main>
  );
}