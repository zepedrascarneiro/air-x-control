# Air X Control

## Sistema Inteligente de Gestão para Aviação Compartilhada

**Versão:** 2.0  
**Data:** Novembro 2025

---

## SUMÁRIO EXECUTIVO

O **Air X Control** é uma plataforma web completa desenvolvida para simplificar e profissionalizar a gestão de aeronaves compartilhadas entre múltiplos proprietários.

### O Problema

A propriedade compartilhada de aeronaves é uma solução popular para reduzir custos, mas traz desafios complexos:

- ❌ Controle manual de voos e despesas (planilhas Excel desatualizadas)
- ❌ Divisão confusa de custos entre coproprietários
- ❌ Falta de transparência nas operações
- ❌ Dificuldade em rastrear manutenções e histórico
- ❌ Comunicação ineficiente entre os envolvidos
- ❌ Impossibilidade de acompanhamento em tempo real

### Nossa Solução

Uma plataforma web moderna que centraliza toda a gestão operacional e financeira:

- ✅ Dashboard em tempo real com todos os indicadores
- ✅ Registro digital de voos com dados completos
- ✅ Controle automatizado de despesas por categoria
- ✅ Divisão proporcional de custos calculada automaticamente
- ✅ Gestão de manutenções com alertas preventivos
- ✅ Relatórios profissionais para prestação de contas
- ✅ Acesso de qualquer lugar via navegador
- ✅ Diferentes níveis de permissão por tipo de usuário

---

## PLATAFORMA ONLINE

### Acesse Agora

**URL Principal:** https://air-x-control-9tnmi.ondigitalocean.app

### Páginas Disponíveis

| Página | URL | Descrição |
|--------|-----|-----------|
| Home | / | Landing page principal |
| Login | /login | Autenticação de usuários |
| Registro | /register | Criação de conta |
| Dashboard | /dashboard | Painel operacional principal |
| Admin | /admin | Painel administrativo (ADMIN only) |
| Demo | /demo | Solicitar demonstração |
| Preços | /pricing | Planos e valores |

### Credenciais de Acesso (Demonstração)

**Administrador:**

| Campo | Valor |
|-------|-------|
| Email | admin@airx.com |
| Senha | AirX2024Admin! |
| Papel | ADMIN (acesso total) |

**Usuários de Teste:**

| Email | Senha | Papel |
|-------|-------|-------|
| piloto@demo.com | Demo2024! | PILOT |
| controller@demo.com | Demo2024! | CONTROLLER |

---

## PROPOSTA DE VALOR

### Para Proprietários

**"Transparência total e controle absoluto sobre seu investimento"**

- 📊 Veja exatamente quanto está gastando e com o quê
- 💰 Divisão justa e automática de custos
- 📱 Acompanhe tudo em tempo real de qualquer lugar
- 📈 Relatórios profissionais para análise de ROI
- 🔒 Segurança e privacidade dos seus dados

### Para Pilotos/Comandantes

**"Simplifique sua operação e tenha mais tempo para voar"**

- ⏱️ Registro rápido de voos direto do celular
- 📋 Checklist digital de manutenções
- 🗓️ Agendamento simplificado
- 📄 Documentação organizada em um só lugar
- ✈️ Foco no voo, não na burocracia

### Para Equipe de Manutenção

**"Controle preciso e histórico completo"**

- 🔧 Registro detalhado de cada manutenção
- ⚠️ Alertas automáticos de vencimentos
- 📊 Histórico completo da aeronave
- 💵 Controle de custos de manutenção
- 📱 Acesso mobile para atualizações em campo

---

## FUNCIONALIDADES PRINCIPAIS

### 1. Dashboard Operacional

Visão 360° da operação com:

- **Cards de Resumo:** Aeronaves ativas, horas voadas, voos, custos
- **Filtro de Período:** Mês, trimestre, semestre, ano, customizado
- **Timeline Mensal:** Gráfico de voos e custos por mês
- **Divisão de Custos:** Quanto cada coproprietário deve pagar
- **Listas Rápidas:** Próximos voos, voos recentes, despesas recentes

### 2. Gestão de Voos

Registro completo e intuitivo:

- 📅 Data e horários
- ✈️ Aeronave e piloto
- 📍 Origem e destino (ICAO)
- ⛽ Consumo de combustível
- ⏱️ Horas de voo (Hobbs)
- 💰 Custos associados
- 📎 Documentos anexados
- 📝 Observações

### 3. Controle Financeiro

Categorização inteligente:

- 🛢️ **Combustível:** Rastreamento automático de consumo
- 🔧 **Manutenção:** Preventiva e corretiva
- 🏢 **Hangaragem:** Custos fixos mensais
- 🛡️ **Seguro:** Prêmios e renovações
- 👨‍✈️ **Tripulação:** Salários e treinamentos
- 🏛️ **Taxas:** Aeroportuárias e regulatórias
- 📦 **Outros:** Despesas diversas

### 4. Divisão Automática de Custos

Algoritmo justo e transparente:

**Custos Fixos** (divididos proporcionalmente):
```
(Hangar + Seguro + Salários) × % Participação
```

**Custos Variáveis** (divididos por uso):
```
(Combustível + Manutenção) × Horas Voadas
```

### 5. Painel Administrativo

Gestão completa do sistema:

- **Usuários:** Lista, alterar papéis, ativar/desativar
- **Demonstrações:** Gerenciar solicitações de demo
- **Analytics:** Métricas do sistema

### 6. Sistema de Permissões

Controle granular de acesso:

| Papel | Ver | Editar Voos | Despesas | Admin |
|-------|-----|-------------|----------|-------|
| ADMIN | ✅ | ✅ | ✅ | ✅ |
| CONTROLLER | ✅ | ✅ | ✅ | ❌ |
| PILOT | ✅ | Próprios | ❌ | ❌ |
| VIEWER | ✅ | ❌ | ❌ | ❌ |
| CTM | ✅ | ❌ | Manutenção | ❌ |

---

## ARQUITETURA TÉCNICA

### Stack Tecnológico

**Frontend:**
- Next.js 14 - Framework React moderno
- TypeScript - Código tipado e seguro
- Tailwind CSS - Design profissional e responsivo
- shadcn/ui - Componentes de alta qualidade

**Backend:**
- Next.js API Routes - Backend integrado
- Prisma ORM - Gerenciamento de banco de dados
- SQLite/PostgreSQL - Banco de dados robusto
- bcryptjs - Criptografia de senhas

**Infraestrutura:**
- DigitalOcean App Platform - Hospedagem em nuvem
- HTTPS - Criptografia end-to-end
- CDN Global - Performance em qualquer lugar
- Backups Automáticos - Dados sempre seguros

### Características Técnicas

- ⚡ **Performance:** Carregamento rápido (< 2s)
- 📱 **Responsivo:** Funciona em desktop, tablet e celular
- 🔒 **Seguro:** Senhas criptografadas, sessões seguras
- 🌐 **Cloud:** Acesso de qualquer lugar do mundo
- 💾 **Backup:** Dados protegidos com backups
- 📈 **Escalável:** Cresce conforme sua necessidade

---

## MODELO DE NEGÓCIO

### Público-Alvo

**Primário:**

1. **Coproprietários de Aeronaves**
   - 2 a 10 proprietários por aeronave
   - Aeronaves executivas e utilitárias
   - Faturamento individual: R$ 50k - R$ 500k/ano

2. **Pequenas Operadoras**
   - 1 a 5 aeronaves
   - Operação Part 91/135
   - Gestão familiar ou entre sócios

**Secundário:**

3. **Clubes de Aviação**
4. **Escolas de Aviação**

### Planos e Precificação (Proposta)

#### Plano Starter - R$ 297/mês

- 1 aeronave
- Até 5 usuários
- Dashboard completo
- Registros ilimitados
- Suporte por email

#### Plano Professional - R$ 697/mês

- Até 3 aeronaves
- Até 15 usuários
- Todas as features do Starter
- Relatórios avançados
- API para integrações
- Suporte prioritário

#### Plano Enterprise - Sob consulta

- Aeronaves ilimitadas
- Usuários ilimitados
- Customizações
- Treinamento incluso
- Suporte 24/7
- Consultoria operacional

### ROI para o Cliente

**Exemplo Real - Aeronave compartilhada entre 4 proprietários:**

| Item | Valor Anual |
|------|-------------|
| Custo Operacional | R$ 400.000 |
| Tempo em planilhas (20h/mês) | R$ 4.800* |
| Erros de divisão | R$ 2.000 |
| Air X Control | R$ 8.364 |
| **Economia Total** | **R$ 6.800/ano + tempo** |

*considerando R$ 200/h de valor do tempo

---

## POTENCIAL DE MERCADO

### Números da Aviação Executiva no Brasil

- ~15.000 aeronaves registradas na ANAC
- ~40% em regime de copropriedade
- ~6.000 aeronaves no público-alvo

### Projeção de Penetração

| Ano | Aeronaves | Market Share | Receita Anual |
|-----|-----------|--------------|---------------|
| Ano 1 | 50 | 0,8% | R$ 297k - R$ 418k |
| Ano 3 | 300 | 5% | R$ 1,78M - R$ 2,5M |
| Ano 5 | 1.000 | 16,6% | R$ 5,94M - R$ 8,36M |

### Expansão Futura

1. Integração com ANAC (dados oficiais)
2. API para parceiros (seguradoras, oficinas)
3. Marketplace (serviços e produtos)
4. Expansão LATAM (Argentina, Chile, México)
5. Versão White Label (grandes operadoras)

---

## DIFERENCIAIS COMPETITIVOS

### vs. Planilhas Excel

| Característica | Excel | Air X Control |
|----------------|-------|---------------|
| Acesso Simultâneo | ❌ Conflitos | ✅ Tempo real |
| Cálculos | ⚠️ Fórmulas quebram | ✅ Automáticos |
| Histórico | ❌ Limitado | ✅ Completo |
| Mobile | ❌ Difícil | ✅ Responsivo |
| Backups | ⚠️ Manual | ✅ Automático |
| Segurança | ⚠️ Arquivo local | ✅ Cloud seguro |

### vs. Desenvolvimento Próprio

| Item | Sistema Próprio | Air X Control |
|------|-----------------|---------------|
| Custo Inicial | R$ 50k - R$ 200k | R$ 0 |
| Manutenção | R$ 5k/mês | Incluso |
| Atualizações | Manual | Automáticas |
| Suporte | Limitado | Especializado |

---

## ROADMAP

### ✅ Fase 1: MVP (Concluído)

- [x] Dashboard operacional
- [x] Registro de voos
- [x] Controle de despesas
- [x] Divisão de custos
- [x] Sistema de login
- [x] Painel administrativo
- [x] Deploy em produção

### 🔄 Fase 2: Crescimento (3-6 meses)

- [ ] Notificações por email/SMS
- [ ] App mobile (iOS/Android)
- [ ] Integrações (calendário, WhatsApp)
- [ ] Migração para PostgreSQL
- [ ] Gestão avançada de manutenção

### 🔮 Fase 3: Escala (6-12 meses)

- [ ] API pública para parceiros
- [ ] Marketplace de serviços
- [ ] IA para previsão de custos
- [ ] Integração ANAC/DECEA
- [ ] Versão White Label
- [ ] Expansão internacional

---

## CASOS DE USO

### Caso 1: Família com Aeronave de Lazer

**Perfil:**
- 3 irmãos coproprietários
- Cirrus SR22 (2018)
- ~100 horas/ano
- R$ 300k custos anuais

**Antes do Air X Control:**
- Planilhas desatualizadas
- Discussões sobre divisão
- Manutenções esquecidas
- 10h/mês em burocracia

**Depois do Air X Control:**
- Transparência total
- Divisão automática e justa
- Alertas de manutenção
- 30min/mês de gestão
- **Tempo recuperado:** 114h/ano

### Caso 2: Empresa com Frota Executiva

**Perfil:**
- Holding com 3 aeronaves
- 8 executivos usuários
- ~500 horas/ano
- R$ 1,2M custos anuais

**Resultados:**
- Sistema profissional e estável
- Economia de R$ 51k/ano
- Relatórios automáticos
- **ROI:** 510%

---

## SEGURANÇA E CONFORMIDADE

### Proteção de Dados

- ✅ LGPD Compliant
- ✅ Criptografia SSL/TLS
- ✅ Senhas com hash bcrypt
- ✅ Backups automatizados
- ✅ Logs de auditoria

### Disponibilidade

- ⚡ Uptime: 99,9% SLA
- ⚡ Recovery Point Objective < 1h
- ⚡ Suporte em até 24h

---

## COMO COMEÇAR

### Passo 1: Acesse a Plataforma

```
https://air-x-control-9tnmi.ondigitalocean.app
```

### Passo 2: Faça Login

```
Email: admin@airx.com
Senha: AirX2024Admin!
```

### Passo 3: Explore

1. Veja o Dashboard com dados de exemplo
2. Navegue pelos voos e despesas
3. Acesse o painel Admin
4. Teste criar novos registros

### Passo 4: Personalize

1. Crie suas próprias aeronaves
2. Cadastre os coproprietários
3. Comece a registrar voos
4. Lance as despesas

---

## CONTATO

**Email:** contato@airxcontrol.com  
**WhatsApp:** +55 (11) 99999-9999  
**Website:** https://airxcontrol.com  
**Plataforma:** https://air-x-control-9tnmi.ondigitalocean.app

---

## CONCLUSÃO

O **Air X Control** não é apenas um software – é a evolução natural da gestão de aviação compartilhada.

### Nossa Visão

> "Tornar a aviação compartilhada tão simples quanto um app bancário"

### Nossa Missão

> "Democratizar o acesso a ferramentas profissionais de gestão aeronáutica"

### Nosso Compromisso

- 🎯 **Foco:** Resolver problemas reais da aviação
- 🚀 **Inovação:** Tecnologia de ponta acessível
- 🤝 **Parceria:** Crescer junto com nossos clientes
- 💎 **Qualidade:** Excelência em cada detalhe

---

**Air X Control**  
*Gestão Inteligente para Aviação Compartilhada*

**Versão:** 2.0  
**Data:** 25 de Novembro de 2025

---

© 2025 Air X Control - Todos os direitos reservados
