# 🛩️ AIR X - ESCOPO COMPLETO DO PROJETO

## 📊 VISÃO GERAL DO SISTEMA

```
┌─────────────────────────────────────────────────────────────────┐
│                      AIR X - INFINITY CONTROL                    │
│         Sistema de Gestão de Cotas de Aeronaves                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 OBJETIVO PRINCIPAL

Criar uma plataforma web completa para **gestão compartilhada de cotas de aviões e helicópteros**, com controle de:
- ✈️ Horas de voo por piloto/cotista
- 💰 Custos operacionais e financeiros
- 📅 Agendamento de voos
- 👥 Múltiplos níveis de acesso
- 💳 Sistema de assinaturas

---

## 🏗️ ARQUITETURA DO PROJETO

```
AIR X MANAGEMENT SYSTEM
│
├── 🎨 FRONTEND (Next.js 14 + React)
│   ├── Landing Page (Página Inicial)
│   ├── Sistema de Login/Registro
│   ├── Dashboards Interativos
│   ├── Calendário/Agenda
│   └── Área de Perfil/Configurações
│
├── 🔐 AUTENTICAÇÃO (NextAuth.js)
│   ├── Login com Email/Senha
│   ├── Recuperação de Senha
│   └── Níveis de Acesso:
│       ├── Controlador/Editor (Full Access)
│       └── Visualizador (Read Only)
│
├── 💾 BACKEND/API (Next.js API Routes)
│   ├── CRUD de Aeronaves
│   ├── CRUD de Horas de Voo
│   ├── CRUD de Custos
│   ├── CRUD de Usuários
│   └── Integração Google Calendar
│
├── 🗄️ BANCO DE DADOS (Prisma + PostgreSQL/MySQL)
│   ├── Tabela: Usuários
│   ├── Tabela: Aeronaves
│   ├── Tabela: Horas de Voo
│   ├── Tabela: Custos/Despesas
│   ├── Tabela: Agendamentos
│   └── Tabela: Assinaturas/Pagamentos
│
└── 💳 PAGAMENTOS (Stripe/outro gateway)
    ├── Planos de Assinatura
    ├── Pagamentos Recorrentes
    └── Gestão de Faturas
```

---

## 📱 MÓDULOS DO SISTEMA

### **1. 🏠 LANDING PAGE** (IMPLEMENTADO ✅)
```
┌──────────────────────────────────┐
│  🔹 Header com Logo Air X        │
│  🔹 Hero Section (Call to Action)│
│  🔹 Features (3 Cards)           │
│  🔹 Estatísticas                 │
│  🔹 Footer                       │
└──────────────────────────────────┘
```
**Status**: ✅ Concluído
**Arquivo**: `/src/app/page.tsx`

---

### **2. 🔐 AUTENTICAÇÃO E ACESSO** (PRÓXIMO)
```
┌──────────────────────────────────┐
│  📄 Página de Login              │
│  📄 Página de Registro           │
│  📄 Recuperação de Senha         │
│                                  │
│  👤 Tipos de Usuário:            │
│     ├── Controlador/Editor       │
│     │   └── Pode: Criar, Editar, │
│     │            Deletar dados   │
│     └── Visualizador             │
│         └── Pode: Apenas ver     │
└──────────────────────────────────┘
```
**Status**: ⏳ Pendente
**Tecnologia**: NextAuth.js

---

### **3. 📊 DASHBOARD PRINCIPAL** (PRÓXIMO)
```
┌─────────────────────────────────────────┐
│  📈 VISÃO GERAL                         │
│  ├── Total de Horas Voadas (Mês)       │
│  ├── Custos do Mês                     │
│  ├── Próximos Voos Agendados           │
│  └── Alertas de Manutenção             │
│                                         │
│  📊 GRÁFICOS                            │
│  ├── Horas por Piloto (Pizza/Barra)   │
│  ├── Custos Mensais (Linha)           │
│  └── Utilização da Aeronave (%)       │
└─────────────────────────────────────────┘
```
**Status**: ⏳ Pendente

---

### **4. ✈️ GESTÃO DE AERONAVES**
```
┌──────────────────────────────────┐
│  🛩️ LISTA DE AERONAVES          │
│  └── Para cada aeronave:         │
│      ├── Modelo/Marca            │
│      ├── Prefixo/Matrícula       │
│      ├── Horas Totais            │
│      ├── Status (Disponível/Manutenção)│
│      ├── Próxima Manutenção      │
│      └── Custos Acumulados       │
│                                  │
│  ➕ Adicionar Nova Aeronave      │
└──────────────────────────────────┘
```

---

### **5. ⏱️ LANÇAMENTO DE HORAS DE VOO**
```
┌──────────────────────────────────┐
│  📝 FORMULÁRIO DE LANÇAMENTO     │
│  ├── Data do Voo                │
│  ├── Aeronave                   │
│  ├── Piloto                     │
│  ├── Horário Decolagem          │
│  ├── Horário Pouso              │
│  ├── Tempo de Voo (calculado)   │
│  ├── Origem/Destino             │
│  ├── Tipo de Voo (Treino/Lazer) │
│  └── Observações                │
│                                  │
│  📋 HISTÓRICO DE VOOS            │
│  └── Tabela com todos os voos   │
└──────────────────────────────────┘
```

---

### **6. 💰 GESTÃO DE CUSTOS**
```
┌──────────────────────────────────┐
│  💵 LANÇAMENTO DE CUSTOS         │
│  ├── Data                       │
│  ├── Aeronave                   │
│  ├── Tipo (Combustível/Manutenção/Seguro)│
│  ├── Valor                      │
│  ├── Fornecedor                 │
│  └── Anexo (Nota Fiscal)        │
│                                  │
│  📊 RELATÓRIOS FINANCEIROS       │
│  ├── Custos por Categoria       │
│  ├── Custo/Hora                 │
│  └── Projeções de Gastos        │
│                                  │
│  💸 APORTES PREVISTOS            │
│  └── Previsão de contribuições  │
└──────────────────────────────────┘
```

---

### **7. 📅 AGENDA COMPARTILHADA**
```
┌──────────────────────────────────┐
│  📆 CALENDÁRIO INTERATIVO        │
│  ├── Visualização: Mês/Semana/Dia│
│  ├── Reservas de Voos            │
│  ├── Eventos de Manutenção       │
│  └── Sincronização Google Calendar│
│                                  │
│  ➕ NOVA RESERVA                 │
│  ├── Data/Hora                  │
│  ├── Aeronave                   │
│  ├── Piloto                     │
│  ├── Destino                    │
│  └── Conflito (Alerta)          │
└──────────────────────────────────┘
```

---

### **8. 💳 SISTEMA DE ASSINATURAS**
```
┌──────────────────────────────────┐
│  📦 PLANOS DISPONÍVEIS           │
│  ├── Básico (1 Aeronave)        │
│  ├── Plus (3 Aeronaves)          │
│  └── Premium (Ilimitado)         │
│                                  │
│  💰 GATEWAY DE PAGAMENTO         │
│  ├── Cartão de Crédito          │
│  ├── Boleto                     │
│  └── Pagamento Recorrente       │
│                                  │
│  📄 FATURAS E HISTÓRICO          │
└──────────────────────────────────┘
```

---

## 🗂️ ESTRUTURA DE PASTAS DO PROJETO

```
air-x-management/
│
├── 📁 src/
│   ├── 📁 app/                          # App Router do Next.js
│   │   ├── 📄 layout.tsx                # Layout principal
│   │   ├── 📄 page.tsx                  # Landing page ✅
│   │   ├── 📄 globals.css               # Estilos globais ✅
│   │   │
│   │   ├── 📁 (auth)/                   # Grupo de rotas de autenticação
│   │   │   ├── 📁 login/
│   │   │   │   └── 📄 page.tsx          # Página de login
│   │   │   ├── 📁 register/
│   │   │   │   └── 📄 page.tsx          # Página de registro
│   │   │   └── 📁 forgot-password/
│   │   │       └── 📄 page.tsx          # Recuperação de senha
│   │   │
│   │   ├── 📁 (dashboard)/              # Grupo protegido (requer login)
│   │   │   ├── 📁 dashboard/
│   │   │   │   └── 📄 page.tsx          # Dashboard principal
│   │   │   ├── 📁 aeronaves/
│   │   │   │   ├── 📄 page.tsx          # Lista de aeronaves
│   │   │   │   └── 📁 [id]/
│   │   │   │       └── 📄 page.tsx      # Detalhes da aeronave
│   │   │   ├── 📁 voos/
│   │   │   │   ├── 📄 page.tsx          # Histórico de voos
│   │   │   │   └── 📁 novo/
│   │   │   │       └── 📄 page.tsx      # Lançar novo voo
│   │   │   ├── 📁 custos/
│   │   │   │   ├── 📄 page.tsx          # Gestão de custos
│   │   │   │   └── 📁 novo/
│   │   │   │       └── 📄 page.tsx      # Lançar custo
│   │   │   ├── 📁 agenda/
│   │   │   │   └── 📄 page.tsx          # Calendário
│   │   │   └── 📁 relatorios/
│   │   │       └── 📄 page.tsx          # Relatórios
│   │   │
│   │   └── 📁 api/                      # API Routes
│   │       ├── 📁 auth/                 # NextAuth endpoints
│   │       ├── 📁 aeronaves/            # CRUD aeronaves
│   │       ├── 📁 voos/                 # CRUD voos
│   │       ├── 📁 custos/               # CRUD custos
│   │       └── 📁 calendar/             # Integração Google Calendar
│   │
│   ├── 📁 components/                   # Componentes reutilizáveis
│   │   ├── 📁 ui/                       # Componentes básicos de UI
│   │   │   ├── 📄 Button.tsx
│   │   │   ├── 📄 Card.tsx
│   │   │   ├── 📄 Input.tsx
│   │   │   ├── 📄 Modal.tsx
│   │   │   └── 📄 Table.tsx
│   │   ├── 📁 layout/
│   │   │   ├── 📄 Header.tsx
│   │   │   ├── 📄 Sidebar.tsx
│   │   │   └── 📄 Footer.tsx
│   │   ├── 📁 dashboard/
│   │   │   ├── 📄 StatCard.tsx          # Card de estatística
│   │   │   ├── 📄 FlightChart.tsx       # Gráfico de voos
│   │   │   └── 📄 CostChart.tsx         # Gráfico de custos
│   │   └── 📁 forms/
│   │       ├── 📄 FlightForm.tsx        # Formulário de voo
│   │       ├── 📄 CostForm.tsx          # Formulário de custo
│   │       └── 📄 AircraftForm.tsx      # Formulário de aeronave
│   │
│   ├── 📁 lib/                          # Utilitários e configurações
│   │   ├── 📄 prisma.ts                 # Cliente Prisma
│   │   ├── 📄 auth.ts                   # Configuração NextAuth
│   │   └── 📄 utils.ts                  # Funções auxiliares
│   │
│   └── 📁 types/                        # TypeScript types
│       ├── 📄 aircraft.ts
│       ├── 📄 flight.ts
│       ├── 📄 cost.ts
│       └── 📄 user.ts
│
├── 📁 prisma/                           # Prisma ORM
│   ├── 📄 schema.prisma                 # Schema do banco de dados
│   └── 📁 migrations/                   # Migrações
│
├── 📁 public/                           # Arquivos estáticos
│   ├── 📁 images/
│   └── 📁 icons/
│
├── 📄 package.json                      # Dependências ✅
├── 📄 tsconfig.json                     # Config TypeScript ✅
├── 📄 tailwind.config.ts                # Config Tailwind ✅
├── 📄 next.config.js                    # Config Next.js ✅
├── 📄 .eslintrc.json                    # Config ESLint ✅
├── 📄 .env.local                        # Variáveis de ambiente
└── 📄 README.md                         # Documentação ✅
```

---

## 🗄️ MODELO DE DADOS (BANCO DE DADOS)

### **Tabelas Principais**

```sql
┌──────────────────────────────────┐
│  👤 USERS (Usuários)             │
├──────────────────────────────────┤
│  id                 (PK)         │
│  name               VARCHAR      │
│  email              VARCHAR      │
│  password           VARCHAR      │
│  role               ENUM         │ ← 'CONTROLLER' | 'VIEWER'
│  avatar             VARCHAR      │
│  created_at         TIMESTAMP    │
│  subscription_id    (FK)         │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  ✈️ AIRCRAFTS (Aeronaves)        │
├──────────────────────────────────┤
│  id                 (PK)         │
│  registration       VARCHAR      │ ← Prefixo (PR-ABC)
│  model              VARCHAR      │ ← Modelo (Cessna 172)
│  manufacturer       VARCHAR      │
│  year               INT          │
│  total_hours        DECIMAL      │
│  status             ENUM         │ ← 'AVAILABLE' | 'MAINTENANCE'
│  next_maintenance   DATE         │
│  owner_id           (FK)         │
│  created_at         TIMESTAMP    │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  🛫 FLIGHTS (Voos)               │
├──────────────────────────────────┤
│  id                 (PK)         │
│  aircraft_id        (FK)         │
│  pilot_id           (FK)         │
│  flight_date        DATE         │
│  departure_time     TIME         │
│  arrival_time       TIME         │
│  flight_hours       DECIMAL      │ ← Calculado automaticamente
│  origin             VARCHAR      │
│  destination        VARCHAR      │
│  flight_type        ENUM         │ ← 'TRAINING' | 'LEISURE' | 'BUSINESS'
│  notes              TEXT         │
│  created_at         TIMESTAMP    │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  💰 COSTS (Custos)               │
├──────────────────────────────────┤
│  id                 (PK)         │
│  aircraft_id        (FK)         │
│  cost_type          ENUM         │ ← 'FUEL' | 'MAINTENANCE' | 'INSURANCE' | 'OTHER'
│  amount             DECIMAL      │
│  date               DATE         │
│  supplier           VARCHAR      │
│  invoice_url        VARCHAR      │
│  description        TEXT         │
│  created_by         (FK)         │
│  created_at         TIMESTAMP    │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  📅 SCHEDULES (Agendamentos)     │
├──────────────────────────────────┤
│  id                 (PK)         │
│  aircraft_id        (FK)         │
│  pilot_id           (FK)         │
│  scheduled_date     DATETIME     │
│  end_date           DATETIME     │
│  destination        VARCHAR      │
│  status             ENUM         │ ← 'PENDING' | 'CONFIRMED' | 'CANCELLED'
│  google_event_id    VARCHAR      │
│  notes              TEXT         │
│  created_at         TIMESTAMP    │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  💳 SUBSCRIPTIONS (Assinaturas)  │
├──────────────────────────────────┤
│  id                 (PK)         │
│  user_id            (FK)         │
│  plan_type          ENUM         │ ← 'BASIC' | 'PLUS' | 'PREMIUM'
│  status             ENUM         │ ← 'ACTIVE' | 'CANCELLED' | 'EXPIRED'
│  start_date         DATE         │
│  end_date           DATE         │
│  payment_method     VARCHAR      │
│  amount             DECIMAL      │
│  created_at         TIMESTAMP    │
└──────────────────────────────────┘
```

---

## 🎨 DESIGN SYSTEM

### **Paleta de Cores**

```
🔵 AIR BLUE (Céu/Aviação)
├── Primary:   #2563eb  (Blue-600)
├── Dark:      #1e3a8a  (Blue-900)
├── Light:     #60a5fa  (Blue-400)
└── Lighter:   #dbeafe  (Blue-100)

🟡 AIR GOLD (Premium/Destaque)
├── Primary:   #eab308  (Yellow-500)
├── Dark:      #a16207  (Yellow-700)
├── Light:     #facc15  (Yellow-400)
└── Lighter:   #fef9c3  (Yellow-100)

⚪ NEUTRAL (Backgrounds/Text)
├── White:     #ffffff
├── Gray-50:   #f9fafb
├── Gray-100:  #f3f4f6
├── Gray-900:  #111827
```

### **Tipografia**

```
Font Family: Inter (Google Fonts)
├── Headings:  font-bold
├── Body:      font-normal
└── Accent:    font-semibold
```

### **Componentes**

```
🔘 Buttons
├── Primary:   bg-air-gold-400 hover:bg-air-gold-300
├── Secondary: border-2 border-white hover:bg-white
└── Danger:    bg-red-500 hover:bg-red-600

📦 Cards
├── Glass:     bg-white/10 backdrop-blur-lg
├── Solid:     bg-white shadow-lg
└── Gradient:  aviation-gradient (Blue gradient)

📋 Forms
├── Input:     border rounded-lg focus:ring-air-blue-500
├── Select:    Custom dropdown styled
└── Checkbox:  Rounded with air-blue accent
```

---

## 🔄 FLUXO DE TRABALHO DO USUÁRIO

### **1. Controlador/Editor** (Acesso Total)
```
Login → Dashboard → [Escolher Ação]
                         ├── Ver Estatísticas
                         ├── Lançar Horas de Voo
                         ├── Adicionar Custos
                         ├── Gerenciar Aeronaves
                         ├── Agendar Voos
                         └── Gerar Relatórios
```

### **2. Visualizador** (Somente Leitura)
```
Login → Dashboard → [Visualizar Apenas]
                         ├── Ver Estatísticas
                         ├── Ver Histórico de Voos
                         ├── Ver Custos
                         ├── Ver Agenda
                         └── Ver Relatórios
                         
[❌ NÃO PODE Criar/Editar/Deletar]
```

---

## 📅 CRONOGRAMA DE DESENVOLVIMENTO

```
┌─────────────────────────────────────────────────┐
│  FASE 1: BASE DO PROJETO (CONCLUÍDO ✅)         │
├─────────────────────────────────────────────────┤
│  ✅ Configuração Next.js + TypeScript           │
│  ✅ Configuração Tailwind CSS                   │
│  ✅ Design System (Cores/Temas)                 │
│  ✅ Landing Page                                │
│  ✅ Estrutura de Pastas                         │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  FASE 2: AUTENTICAÇÃO (PRÓXIMA)                 │
├─────────────────────────────────────────────────┤
│  ⏳ Instalar NextAuth.js                        │
│  ⏳ Criar páginas de Login/Registro             │
│  ⏳ Implementar controle de acesso por Role     │
│  ⏳ Proteção de rotas                           │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  FASE 3: BANCO DE DADOS (DEPOIS)                │
├─────────────────────────────────────────────────┤
│  ⏳ Configurar Prisma                           │
│  ⏳ Modelar schema (Users, Aircrafts, etc)      │
│  ⏳ Criar migrações                             │
│  ⏳ Seed inicial de dados                       │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  FASE 4: DASHBOARDS E FUNCIONALIDADES           │
├─────────────────────────────────────────────────┤
│  ⏳ Dashboard Principal                         │
│  ⏳ CRUD de Aeronaves                           │
│  ⏳ Sistema de Lançamento de Horas              │
│  ⏳ Sistema de Custos                           │
│  ⏳ Relatórios e Gráficos                       │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  FASE 5: AGENDA E INTEGRAÇÕES                   │
├─────────────────────────────────────────────────┤
│  ⏳ Calendário Interativo                       │
│  ⏳ API Google Calendar                         │
│  ⏳ Sistema de Notificações                     │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  FASE 6: PAGAMENTOS E ASSINATURAS               │
├─────────────────────────────────────────────────┤
│  ⏳ Integração Gateway de Pagamento             │
│  ⏳ Planos de Assinatura                        │
│  ⏳ Controle de Acesso por Plano                │
└─────────────────────────────────────────────────┘
```

---

## 🚀 COMO RODAR O PROJETO AGORA

```bash
# 1. Navegar para o diretório
cd "/Users/josecarneiro/Desktop/Air X "

# 2. Instalar dependências (já feito ✅)
npm install

# 3. Iniciar servidor de desenvolvimento (já rodando ✅)
npm run dev

# 4. Abrir no navegador
http://localhost:3000
```

---

## 📦 TECNOLOGIAS E DEPENDÊNCIAS

### **Já Instaladas ✅**
- ✅ Next.js 14.2
- ✅ React 18.3
- ✅ TypeScript 5.6
- ✅ Tailwind CSS 3.4
- ✅ ESLint 8.57

### **A Instalar Próximas Fases**
- ⏳ NextAuth.js (Autenticação)
- ⏳ Prisma (ORM do Banco)
- ⏳ React Hook Form (Formulários)
- ⏳ Zod (Validação)
- ⏳ Chart.js / Recharts (Gráficos)
- ⏳ date-fns (Manipulação de datas)
- ⏳ React Calendar (Calendário)
- ⏳ Stripe (Pagamentos)

---

## 🎯 DIFERENCIAL DO AIR X

```
┌────────────────────────────────────────────────┐
│  O QUE TORNA O AIR X ÚNICO?                    │
├────────────────────────────────────────────────┤
│  ✈️ Focado EXCLUSIVAMENTE em aviação          │
│  📊 Dashboards EXTREMAMENTE intuitivos         │
│  🎨 Design premium inspirado na aviação        │
│  📅 Integração real com Google Calendar        │
│  🔐 Sistema robusto de controle de acesso      │
│  💰 Previsão financeira e gestão de aportes    │
│  📱 100% Responsivo (Mobile-first)             │
│  🚀 Performance otimizada (Next.js)            │
└────────────────────────────────────────────────┘
```

---

## 📝 PRÓXIMOS PASSOS IMEDIATOS

1. **Analisar Tabela Excel** 📊
   - Entender campos existentes
   - Mapear para estrutura de dados

2. **Configurar Autenticação** 🔐
   - Instalar NextAuth.js
   - Criar fluxo de login/registro

3. **Configurar Banco de Dados** 💾
   - Instalar Prisma
   - Criar schema inicial

4. **Criar Primeiros Dashboards** 📈
   - Dashboard principal
   - Lista de aeronaves

---

**🎉 Seu projeto está ORGANIZADO e PRONTO para crescer!**