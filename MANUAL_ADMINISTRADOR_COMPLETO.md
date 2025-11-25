# Manual do Administrador - Air X Control

## Sistema de Gestão de Aviação Compartilhada

**Versão:** 2.0  
**Data:** Novembro 2025  
**Documento:** Guia Completo de Operação e Administração

---

# 📋 Índice

1. Acesso ao Sistema
2. Credenciais e Usuários
3. Dashboard Principal
4. Painel Administrativo
5. Gestão de Usuários
6. Gestão de Aeronaves
7. Registro de Voos
8. Controle de Despesas
9. Divisão de Custos
10. Demo Requests
11. Relatórios
12. Comandos Técnicos
13. Solução de Problemas

---

# 1. ACESSO AO SISTEMA

## URLs de Acesso

| Ambiente | URL |
|----------|-----|
| **Produção** | https://air-x-control-9tnmi.ondigitalocean.app |
| **Dashboard** | https://air-x-control-9tnmi.ondigitalocean.app/dashboard |
| **Painel Admin** | https://air-x-control-9tnmi.ondigitalocean.app/admin |
| **Login** | https://air-x-control-9tnmi.ondigitalocean.app/login |
| **Registro** | https://air-x-control-9tnmi.ondigitalocean.app/register |
| **Demo** | https://air-x-control-9tnmi.ondigitalocean.app/demo |
| **Preços** | https://air-x-control-9tnmi.ondigitalocean.app/pricing |

## Segurança

- ✅ HTTPS habilitado (SSL/TLS)
- ✅ Senhas com hash bcrypt
- ✅ Sessões seguras com cookies httpOnly
- ✅ Proteção CSRF
- ✅ Timeout automático de sessão

---

# 2. CREDENCIAIS E USUÁRIOS

## Usuário Administrador Master

```
Email:    admin@airx.com
Senha:    AirX2024Admin!
Papel:    ADMIN (acesso total)
```

## Usuários de Demonstração

```
Piloto Demo:
Email:    piloto@demo.com
Senha:    Demo2024!
Papel:    PILOT

Controller Demo:
Email:    controller@demo.com
Senha:    Demo2024!
Papel:    CONTROLLER
```

## Dados de Demonstração Pré-Cadastrados

### Aeronaves

| Matrícula | Modelo | Fabricante | Horas |
|-----------|--------|------------|-------|
| PP-JCF | Cirrus SR22 | Cirrus | 1.245,5h |
| PP-XYZ | Cessna 172 | Cessna | 2.890,0h |

### Voos Recentes (últimos 30 dias)

| Data | Aeronave | Origem | Destino | Duração |
|------|----------|--------|---------|---------|
| Hoje -5d | PP-JCF | SBSP | SBRJ | 1.2h |
| Hoje -12d | PP-JCF | SBRJ | SBSP | 1.1h |
| Hoje -20d | PP-XYZ | SBSP | SBKP | 0.6h |
| Hoje -25d | PP-XYZ | SBKP | SBSP | 0.5h |

### Despesas Cadastradas

| Categoria | Descrição | Valor |
|-----------|-----------|-------|
| FUEL | Abastecimento PP-JCF | R$ 2.500,00 |
| FUEL | Abastecimento PP-XYZ | R$ 1.800,00 |
| MAINTENANCE | Troca de óleo PP-JCF | R$ 3.500,00 |
| HANGAR | Mensalidade hangar | R$ 4.500,00 |
| INSURANCE | Seguro anual | R$ 18.000,00 |
| AIRPORT_FEES | Taxas aeroportuárias | R$ 890,00 |

---

# 3. DASHBOARD PRINCIPAL

## Acesso

URL: `/dashboard`

Requer autenticação. Redireciona automaticamente para `/login` se não autenticado.

## Componentes do Dashboard

### Cards de Resumo (topo)

1. **Aeronaves Ativas** - Total de aeronaves cadastradas
2. **Horas da Frota** - Total de horas voadas no período
3. **Voos Realizados** - Quantidade de voos no período
4. **Custo Operacional** - Total de despesas no período

### Seletor de Período

Localizado abaixo dos cards. Opções:

- Mês Atual
- Últimos 3 Meses
- Últimos 6 Meses
- Ano Atual
- Período Customizado

### Timeline Mensal

Gráfico visual mostrando distribuição de voos e custos por mês.

### Painel de Coproprietários

Exibe divisão proporcional de custos:
- Nome do coproprietário
- % de participação
- Valor a pagar no período
- Horas voadas

### Painel de Edição (ADMIN/CONTROLLER)

Disponível apenas para usuários com permissão:
- Criar Nova Aeronave
- Criar Novo Voo
- Criar Nova Despesa

---

# 4. PAINEL ADMINISTRATIVO

## Acesso

URL: `/admin`

**IMPORTANTE:** Requer papel ADMIN para acesso.

## Abas Disponíveis

### Aba 1: Usuários

Lista completa de usuários do sistema com:

| Campo | Descrição |
|-------|-----------|
| Nome | Nome completo do usuário |
| Email | Email de acesso |
| Papel | ADMIN, CONTROLLER, PILOT, VIEWER, CTM |
| Status | ACTIVE, INACTIVE, PENDING |
| Criado em | Data de criação da conta |
| Sessões | Quantidade de sessões ativas |

**Ações disponíveis:**

- **Alterar Papel:** Clique no select de papel e escolha novo papel
- **Ativar/Desativar:** Toggle de status ACTIVE ↔ INACTIVE

### Aba 2: Demonstrações

Lista de solicitações de demonstração recebidas:

| Campo | Descrição |
|-------|-----------|
| Nome | Nome do interessado |
| Email | Email de contato |
| Empresa | Nome da empresa |
| Telefone | Telefone de contato |
| Aeronaves | Quantidade de aeronaves |
| Mensagem | Mensagem enviada |
| Status | PENDING, SCHEDULED, COMPLETED, CANCELLED |
| Data | Data da solicitação |

**Status de Demo:**

- **PENDING** (🟡) - Aguardando contato
- **SCHEDULED** (🔵) - Agendada
- **COMPLETED** (🟢) - Realizada
- **CANCELLED** (🔴) - Cancelada

### Aba 3: Analytics

Métricas gerais do sistema:

- Total de Usuários
- Total de Voos
- Total de Despesas
- Demo Requests pendentes

Gráficos de:
- Voos por mês
- Despesas por categoria
- Crescimento de usuários

---

# 5. GESTÃO DE USUÁRIOS

## Hierarquia de Papéis

### ADMIN (Administrador)

```
Permissões:
✅ Acesso total ao sistema
✅ Painel administrativo (/admin)
✅ Criar, editar, deletar TUDO
✅ Gerenciar usuários
✅ Ver logs e métricas
✅ Exportar dados
✅ Configurar sistema
```

### CONTROLLER (Controlador)

```
Permissões:
✅ Criar, editar, deletar voos
✅ Criar, editar, deletar despesas
✅ Criar, editar aeronaves
✅ Ver dashboard completo
✅ Exportar relatórios
❌ NÃO acessa /admin
❌ NÃO gerencia usuários
```

### PILOT (Piloto)

```
Permissões:
✅ Ver dashboard
✅ Ver todos os voos
✅ Editar APENAS voos que pilotou
✅ Adicionar notas nos seus voos
❌ NÃO pode deletar voos
❌ NÃO pode criar/editar despesas
❌ Acesso limitado a dados financeiros
```

### VIEWER (Visualizador)

```
Permissões:
✅ Ver dashboard (somente leitura)
✅ Ver lista de voos
✅ Ver despesas gerais
❌ NÃO pode editar nada
❌ NÃO pode criar registros
```

### CTM (Controle de Manutenção)

```
Permissões:
✅ Ver dashboard
✅ Criar/editar despesas de MANUTENÇÃO
✅ Ver histórico de manutenções
❌ NÃO pode criar voos
❌ Acesso limitado a outras despesas
```

## Criar Novo Usuário

### Método 1: Auto-cadastro

1. Usuário acessa `/register`
2. Preenche formulário
3. Conta criada com papel padrão (VIEWER)
4. Admin altera papel no painel admin

### Método 2: Via Script

```bash
cd "/Users/josecarneiro/Desktop/Air X Control"
node scripts/create-admin-user.mjs
```

### Método 3: Via Prisma Studio

```bash
npx prisma studio
# Abre interface web para editar banco de dados
```

## Alterar Papel de Usuário

1. Acesse `/admin`
2. Aba "Usuários"
3. Localize o usuário
4. Clique no seletor de papel
5. Escolha novo papel
6. Alteração é salva automaticamente

## Desativar Usuário

1. Acesse `/admin`
2. Aba "Usuários"
3. Clique no toggle de status
4. Status muda para INACTIVE
5. Usuário não consegue mais fazer login

---

# 6. GESTÃO DE AERONAVES

## Criar Nova Aeronave

### Acesso
Dashboard → Painel de Edição → "Criar Nova Aeronave"

### Campos

| Campo | Obrigatório | Descrição |
|-------|-------------|-----------|
| Matrícula | ✅ | Identificação única (ex: PP-ABC) |
| Modelo | ✅ | Modelo da aeronave |
| Fabricante | ✅ | Nome do fabricante |
| Ano | ❌ | Ano de fabricação |
| Status | ✅ | ACTIVE, MAINTENANCE, INACTIVE |
| Horas Totais | ❌ | Total de horas Hobbs |
| Próxima Manutenção | ❌ | Data da próxima manutenção |
| Notas | ❌ | Observações gerais |

### Exemplo

```
Matrícula: PP-NEW
Modelo: King Air 350
Fabricante: Beechcraft
Ano: 2022
Status: ACTIVE
Horas Totais: 450.5
Próxima Manutenção: 15/03/2026
Notas: Configuração executiva 8 lugares
```

## Editar Aeronave

1. Dashboard → Localize a aeronave
2. Clique no ícone de edição (✏️)
3. Modifique os campos
4. Clique em Salvar

## Desativar Aeronave

Para aeronaves fora de operação:
1. Edite a aeronave
2. Mude Status para INACTIVE
3. Adicione motivo nas notas
4. Salve

---

# 7. REGISTRO DE VOOS

## Criar Novo Voo

### Acesso
Dashboard → Painel de Edição → "Criar Novo Voo"

### Campos do Voo

**Informações Básicas:**

| Campo | Obrigatório | Descrição |
|-------|-------------|-----------|
| Data | ✅ | Data e hora de partida |
| Aeronave | ✅ | Selecione da lista |
| Piloto | ✅ | Selecione o piloto |
| Origem | ✅ | ICAO do aeródromo (ex: SBSP) |
| Destino | ✅ | ICAO do aeródromo (ex: SBRJ) |

**Dados de Combustível:**

| Campo | Descrição |
|-------|-----------|
| Combustível Inicial | Litros no início |
| Combustível Final | Litros ao término |
| Consumo | Calculado automaticamente |

**Dados Operacionais:**

| Campo | Descrição |
|-------|-----------|
| Duração | Horas em decimal (1.5 = 1h30min) |
| Hobbs Inicial | Leitura inicial |
| Hobbs Final | Leitura final |
| Absorção Base | Valor da taxa de base |
| Impostos/Taxas | Taxas aeroportuárias |

**Custos Associados:**

| Campo | Descrição |
|-------|-----------|
| Despesas Viagem | Alimentação, hotel, transporte |
| Manutenção Rota | Reparos durante viagem |

**Documentação:**

| Campo | Descrição |
|-------|-----------|
| Anexos | PDFs, imagens (plano de voo, recibos) |
| Notas | Observações sobre o voo |

### Exemplo Completo

```
Data: 25/11/2025 09:00
Aeronave: PP-JCF (Cirrus SR22)
Piloto: João Silva
Origem: SBSP
Destino: SBRJ

Combustível Inicial: 180L
Combustível Final: 120L
Consumo: 60L

Duração: 1.2h
Hobbs Inicial: 1245.5
Hobbs Final: 1246.7

Absorção Base: R$ 350,00
Taxas: R$ 180,00
Despesas Viagem: R$ 150,00
Manutenção Rota: R$ 0,00

Notas: Voo sem intercorrências, céu claro
```

## Permissões de Edição

| Papel | Criar | Editar | Deletar |
|-------|-------|--------|---------|
| ADMIN | ✅ Todos | ✅ Todos | ✅ Todos |
| CONTROLLER | ✅ Todos | ✅ Todos | ✅ Todos |
| PILOT | ❌ | ✅ Próprios | ❌ |
| VIEWER | ❌ | ❌ | ❌ |
| CTM | ❌ | ❌ | ❌ |

---

# 8. CONTROLE DE DESPESAS

## Categorias de Despesas

| Código | Nome | Descrição |
|--------|------|-----------|
| FUEL | Combustível | Abastecimentos |
| MAINTENANCE | Manutenção | Preventiva e corretiva |
| HANGAR | Hangaragem | Aluguel de hangar |
| INSURANCE | Seguro | Prêmios de seguro |
| CREW | Tripulação | Salários, diárias |
| AIRPORT_FEES | Taxas | Pouso, navegação, estacionamento |
| OTHER | Outros | Despesas diversas |

## Criar Nova Despesa

### Acesso
Dashboard → Painel de Edição → "Criar Nova Despesa"

### Campos

| Campo | Obrigatório | Descrição |
|-------|-------------|-----------|
| Data | ✅ | Data da despesa |
| Categoria | ✅ | Selecione da lista |
| Valor | ✅ | Valor em R$ |
| Descrição | ✅ | Detalhamento |
| Aeronave | ❌ | Vincular a aeronave |
| Voo | ❌ | Vincular a voo específico |
| Notas | ❌ | Observações |

### Exemplo

```
Data: 25/11/2025
Categoria: MAINTENANCE
Valor: R$ 3.500,00
Descrição: Troca de óleo e filtro - 100h
Aeronave: PP-JCF
Voo: (nenhum)
Notas: Realizado na oficina homologada XYZ
```

## Vincular Despesa a Voo

Quando uma despesa está relacionada a um voo:
1. Crie/edite a despesa
2. Selecione o voo no campo "Voo Relacionado"
3. A despesa aparecerá nos detalhes do voo
4. Permite rastreabilidade completa

---

# 9. DIVISÃO DE CUSTOS

## Conceito

O sistema calcula automaticamente a divisão de custos entre coproprietários baseado em:

- Percentual de participação
- Horas voadas individualmente
- Custos fixos vs. variáveis

## Fórmula

**Custos Fixos** (divididos proporcionalmente):
```
(Hangar + Seguro + Salários) × % Participação
```

**Custos Variáveis** (divididos por uso):
```
(Combustível + Manutenção Horária) × Horas Voadas Individuais
```

## Visualização no Dashboard

```
┌─────────────────────────────────────────┐
│ DIVISÃO DE CUSTOS - Novembro 2025       │
├─────────────────────────────────────────┤
│                                         │
│ João Silva (50%)                        │
│ Horas: 12.5h | A pagar: R$ 18.750,00   │
│                                         │
│ Carlos Santos (30%)                     │
│ Horas: 6.0h  | A pagar: R$ 9.450,00    │
│                                         │
│ Maria Oliveira (20%)                    │
│ Horas: 3.5h  | A pagar: R$ 5.800,00    │
│                                         │
└─────────────────────────────────────────┘
```

---

# 10. DEMO REQUESTS

## O que são

Solicitações de demonstração enviadas por interessados através da página `/demo`.

## Fluxo de Atendimento

1. **Interessado preenche formulário** em `/demo`
2. **Sistema registra** com status PENDING
3. **Admin visualiza** no painel `/admin`
4. **Admin agenda demonstração** → status SCHEDULED
5. **Demo realizada** → status COMPLETED
6. Ou **Demo cancelada** → status CANCELLED

## Campos Capturados

| Campo | Descrição |
|-------|-----------|
| Nome | Nome do interessado |
| Email | Email para contato |
| Empresa | Nome da empresa |
| Telefone | Telefone de contato |
| Aeronaves | Quantidade de aeronaves |
| Mensagem | Mensagem opcional |

## Gerenciar Demos

1. Acesse `/admin`
2. Clique na aba "Demonstrações"
3. Visualize todas as solicitações
4. Atualize o status conforme progresso

---

# 11. RELATÓRIOS

## Tipos de Relatórios

1. **Relatório Operacional**
   - Voos realizados
   - Horas totais
   - Utilização de aeronaves

2. **Relatório Financeiro**
   - Despesas por categoria
   - Custos por voo
   - Divisão entre coproprietários

3. **Relatório de Manutenção**
   - Histórico de manutenções
   - Próximas manutenções
   - Custos de manutenção

## Exportar Dados

**Para Excel:**
1. Selecione período no Dashboard
2. Clique em "Exportar"
3. Escolha tipo de relatório
4. Download automático

**Para PDF:**
1. Use impressão do navegador (Ctrl+P / Cmd+P)
2. Selecione "Salvar como PDF"
3. Ajuste margens e orientação

---

# 12. COMANDOS TÉCNICOS

## DigitalOcean CLI (doctl)

### Ver Status da Aplicação

```bash
doctl apps get 6e5b8e1d-1872-40b3-9b8d-53c0a542d721
```

### Ver Logs em Tempo Real

```bash
doctl apps logs 6e5b8e1d-1872-40b3-9b8d-53c0a542d721 --follow
```

### Ver Logs de Build

```bash
doctl apps logs 6e5b8e1d-1872-40b3-9b8d-53c0a542d721 --type build
```

### Fazer Novo Deploy

```bash
doctl apps create-deployment 6e5b8e1d-1872-40b3-9b8d-53c0a542d721 --force-rebuild
```

### Listar Deployments

```bash
doctl apps list-deployments 6e5b8e1d-1872-40b3-9b8d-53c0a542d721
```

## Prisma (Banco de Dados)

### Abrir Interface Visual

```bash
cd "/Users/josecarneiro/Desktop/Air X Control"
npx prisma studio
```

### Gerar Cliente

```bash
npx prisma generate
```

### Sincronizar Schema

```bash
npx prisma db push
```

### Resetar Banco (CUIDADO!)

```bash
npx prisma db push --force-reset
```

### Rodar Seed

```bash
npx tsx prisma/seed.ts
```

## Git

### Ver Status

```bash
git status
```

### Commit e Push

```bash
git add -A
git commit -m "descrição"
git push
```

## Backup Local

```bash
cp prisma/dev.db prisma/dev.db.backup-$(date +%Y%m%d)
```

---

# 13. SOLUÇÃO DE PROBLEMAS

## Não consigo fazer login

**Sintoma:** "Credenciais inválidas"

**Soluções:**
1. Verifique email (case-sensitive)
2. Confirme senha (incluindo caracteres especiais)
3. Verifique se conta está ACTIVE
4. Limpe cookies do navegador
5. Tente em janela anônima

## Dashboard não carrega

**Soluções:**
1. Limpe cache (Ctrl+Shift+Delete)
2. Tente em modo anônimo
3. Verifique conexão internet
4. Verifique se aplicação está no ar

## Dados não aparecem

**Soluções:**
1. Verifique filtro de período
2. Confirme se há dados cadastrados
3. Verifique suas permissões
4. Recarregue a página (F5)

## Erro ao criar voo

**Soluções:**
1. Preencha todos campos obrigatórios
2. Verifique formato de data
3. Valores numéricos sem texto
4. Selecione aeronave e piloto

## Painel de edição não aparece

**Causa:** Permissões insuficientes

**Solução:**
1. Verifique seu papel (role)
2. Apenas ADMIN e CONTROLLER têm acesso
3. Contate administrador para upgrade

## Painel Admin não carrega

**Causa:** Não tem papel ADMIN

**Solução:**
1. Faça login com conta ADMIN
2. Ou peça para admin alterar seu papel

## Aplicação offline

**Verificar status:**
```bash
doctl apps get 6e5b8e1d-1872-40b3-9b8d-53c0a542d721
```

**Ver logs de erro:**
```bash
doctl apps logs 6e5b8e1d-1872-40b3-9b8d-53c0a542d721 --tail 50
```

---

# INFORMAÇÕES TÉCNICAS

## Stack Tecnológico

| Camada | Tecnologia |
|--------|------------|
| Frontend | Next.js 14, React 18, TypeScript |
| Estilização | Tailwind CSS, shadcn/ui |
| Backend | Next.js API Routes |
| ORM | Prisma 5.22 |
| Banco de Dados | SQLite (dev) / PostgreSQL (prod) |
| Autenticação | Cookies httpOnly + bcrypt |
| Hospedagem | DigitalOcean App Platform |

## Estrutura de Pastas

```
/src
  /app
    /admin          → Painel administrativo
    /api            → Endpoints da API
      /admin        → APIs do admin
      /aircraft     → CRUD aeronaves
      /auth         → Login/logout/register
      /demo         → Demo requests
      /expenses     → CRUD despesas
      /flights      → CRUD voos
    /dashboard      → Dashboard principal
    /demo           → Página de demo request
    /login          → Página de login
    /pricing        → Página de preços
    /register       → Página de registro
  /components       → Componentes React
  /lib              → Utilitários e helpers
/prisma
  schema.prisma     → Schema do banco
  seed.ts           → Dados iniciais
```

## Modelo de Dados

### User (Usuário)
- id, email, password, name, role, status, createdAt

### Aircraft (Aeronave)
- id, registration, model, manufacturer, year, status, totalHours

### Flight (Voo)
- id, date, aircraftId, pilotId, origin, destination, duration, fuelStart, fuelEnd, etc.

### Expense (Despesa)
- id, date, category, amount, description, aircraftId, flightId

### DemoRequest (Solicitação Demo)
- id, name, email, company, phone, aircraftCount, message, status

### Session (Sessão)
- id, userId, token, expiresAt

---

# CONTATO E SUPORTE

**Email:** suporte@airxcontrol.com  
**Aplicação:** https://air-x-control-9tnmi.ondigitalocean.app  
**Repositório:** https://github.com/zepedrascarneiro/air-x-control

---

**Air X Control**  
*Gestão Inteligente para Aviação Compartilhada*

**Versão:** 2.0  
**Última Atualização:** 25 de Novembro de 2025

---

© 2025 Air X Control - Todos os direitos reservados
