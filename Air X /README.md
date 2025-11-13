# Air X - Sistema de Gestão de Cotas de Aeronaves

## 🛩️ Visão Geral

O **Air X** é um sistema completo de gestão de cotas compartilhadas para aviões e helicópteros, oferecendo dashboards intuitivos, controle de acesso diferenciado e integração com agendas externas.

## ✨ Funcionalidades Principais

### 🎯 Controle de Acesso
- **Controlador/Editor**: Controle total sobre lançamento de horas, custos e gestão da agenda
- **Visualização**: Acesso apenas para consulta de dados e relatórios

### 📊 Dashboards Inteligentes
- Controle de horas de voo em tempo real
- Gestão de custos operacionais
- Previsão de aportes financeiros
- Relatórios detalhados por aeronave

### 📅 Agenda Compartilhada
- Integração completa com Google Calendar
- Gestão de reservas de aeronaves
- Sincronização automática
- Conflitos de agendamento

### 💳 Sistema de Assinaturas
- Controle de acesso baseado em planos
- Gestão de pagamentos
- Área restrita para usuários cadastrados

## 🚀 Tecnologias Utilizadas

- **Next.js 14+** com App Router
- **TypeScript** para tipagem estática
- **Tailwind CSS** para estilização
- **ESLint** para qualidade de código
- **Vercel** para deploy (planejado)

## 🎨 Design System

### Paleta de Cores
- **Air Blue**: Tons de azul representando o céu e aviação
- **Air Gold**: Tons dourados para destaques e elementos premium

### Tema
Design focado em aviação com elementos modernos e clean, inspirado na identidade "Air X".

## 🏗️ Estrutura do Projeto

```
air-x-management/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
├── .eslintrc.json
├── .github/
│   └── copilot-instructions.md
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## 🛠️ Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação
```bash
npm install
```

### Desenvolvimento
```bash
npm run dev
```
Acesse: http://localhost:3000

### Build para Produção
```bash
npm run build
npm start
```

## 📋 Próximos Passos

### Fase 1 - Estrutura Base ✅
- [x] Configuração inicial do workspace
- [x] Design system e identidade visual
- [x] Landing page

### Fase 2 - Autenticação (Em desenvolvimento)
- [ ] Sistema de login/registro
- [ ] Controle de acesso por níveis
- [ ] Gestão de usuários

### Fase 3 - Dashboards
- [ ] Dashboard principal
- [ ] Gestão de horas de voo
- [ ] Controle de custos
- [ ] Relatórios financeiros

### Fase 4 - Agenda
- [ ] Interface de agendamento
- [ ] Integração Google Calendar
- [ ] Gestão de conflitos

### Fase 5 - Assinaturas
- [ ] Planos de assinatura
- [ ] Gateway de pagamento
- [ ] Controle de acesso premium

## 🤝 Contribuição

Este é um projeto privado para gestão de cotas de aeronaves. Para mais informações sobre contribuições, entre em contato com a equipe de desenvolvimento.

## 📄 Licença

Todos os direitos reservados © 2025 Air X

---

**Air X** - *Infinity Control*
Desenvolvido com tecnologia de ponta para aviação moderna.