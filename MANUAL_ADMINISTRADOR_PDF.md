---
title: "Manual do Administrador - Air X Control"
subtitle: "Sistema de Gestão de Aviação Compartilhada"
author: "Air X Control"
date: "Novembro 2025"
version: "2.0"
---

# Manual do Administrador

## Air X Control - Sistema de Gestão de Aviação Compartilhada

### 🎯 Guia Completo de Operação e Administração

---

## 📋 Índice

1. [Acesso ao Sistema](#acesso-ao-sistema)
2. [Credenciais e Usuários de Teste](#credenciais-e-usuarios-de-teste)
3. [Visão Geral do Dashboard](#visão-geral-do-dashboard)
4. [Painel Administrativo](#painel-administrativo)
5. [Hierarquia de Usuários](#hierarquia-de-usuários)
6. [Gestão de Aeronaves](#gestão-de-aeronaves)
7. [Registro de Voos](#registro-de-voos)
8. [Controle de Despesas](#controle-de-despesas)
9. [Divisão de Custos](#divisão-de-custos)
10. [Gerenciamento de Usuários](#gerenciamento-de-usuários)
11. [Gestão de Demo Requests](#gestão-de-demo-requests)
12. [Relatórios e Exportação](#relatórios-e-exportação)
13. [Configurações do Sistema](#configurações-do-sistema)
14. [Solução de Problemas](#solução-de-problemas)
15. [Comandos de Terminal](#comandos-de-terminal)
16. [Arquitetura Técnica](#arquitetura-técnica)

---

## 1. Acesso ao Sistema

### URL da Aplicação

```
https://air-x-control-9tnmi.ondigitalocean.app
```

### Credenciais de Acesso

**Administrador Master:**

- **Email:** `admin@airx.com`
- **Senha:** `AirX2024Admin!`
- **Papel:** ADMIN (acesso total)

### Primeiro Acesso

1. Acesse a URL acima
2. Clique em "Login" ou acesse diretamente `/login`
3. Insira suas credenciais
4. Você será redirecionado automaticamente para o Dashboard

### Segurança

- ✅ Todas as comunicações são criptografadas (HTTPS)
- ✅ Senhas armazenadas com hash bcrypt
- ✅ Sessões com timeout automático
- ✅ Autenticação em duas etapas (em breve)

---

## 2. Visão Geral do Dashboard

O Dashboard é o coração do sistema, apresentando todos os dados operacionais em tempo real.

### Componentes Principais

#### Cards de Resumo (Topo da Página)

1. **Aeronaves Ativas**
   - Quantidade total de aeronaves na frota
   - Status operacional

2. **Horas da Frota**
   - Total de horas voadas no período selecionado
   - Indicador de utilização

3. **Voos Realizados**
   - Número de voos no período
   - Tendência comparativa

4. **Custo Operacional**
   - Valor total de despesas no período
   - Breakdown por categoria

#### Filtro de Período

Localizado no topo, permite visualizar dados em diferentes janelas de tempo:

- **Mês Atual:** Dados do mês corrente
- **Últimos 3 Meses:** Trimestre móvel
- **Últimos 6 Meses:** Semestre móvel
- **Ano Atual:** Do dia 1º de janeiro até hoje
- **Período Customizado:** Selecione datas específicas

#### Timeline Mensal

Gráfico visual mostrando:

- Distribuição de voos por mês
- Custos mensais acumulados
- Tendências operacionais

#### Painel de Coproprietários

Exibe a divisão proporcional de custos entre os coproprietários:

- Nome do coproprietário
- Percentual de participação
- Valor a pagar no período
- Total acumulado

#### Listas Rápidas

- **Próximos Voos:** Voos agendados (futuros)
- **Voos Recentes:** Últimos voos completados
- **Despesas Recentes:** Últimas despesas lançadas
- **Top Categorias:** Maiores gastos por categoria

---

## 3. Hierarquia de Usuários

O sistema possui 5 níveis de acesso, cada um com permissões específicas:

### ADMIN (Administrador Completo)

**Permissões:**

- ✅ Acesso total ao sistema
- ✅ Criar, editar e deletar qualquer dado
- ✅ Gerenciar todos os usuários
- ✅ Acessar painel administrativo
- ✅ Exportar todos os dados
- ✅ Configurar parâmetros do sistema
- ✅ Ver logs de auditoria

**Uso Recomendado:** Proprietário principal, gestor da operação

### CONTROLLER (Controlador/Comandante)

**Permissões:**

- ✅ Criar, editar e deletar voos
- ✅ Criar, editar e deletar despesas
- ✅ Criar e editar aeronaves
- ✅ Ver dashboard completo
- ✅ Exportar relatórios
- ❌ Não pode gerenciar usuários
- ❌ Não acessa painel administrativo

**Uso Recomendado:** Comandante, gestor operacional, administrador executivo

### PILOT (Piloto)

**Permissões:**

- ✅ Ver dashboard completo
- ✅ Ver todos os voos
- ✅ Editar voos que pilotou
- ✅ Adicionar notas aos seus voos
- ❌ Não pode deletar voos
- ❌ Não pode criar/editar despesas
- ❌ Acesso limitado a dados financeiros

**Uso Recomendado:** Copilotos, pilotos auxiliares

### VIEWER (Visualizador)

**Permissões:**

- ✅ Ver dashboard (somente leitura)
- ✅ Ver lista de voos
- ✅ Ver despesas gerais
- ✅ Ver relatórios compartilhados
- ❌ Não pode editar nada
- ❌ Não pode criar registros
- ❌ Acesso limitado a dados sensíveis

**Uso Recomendado:** Coproprietários, investidores, passageiros frequentes

### CTM (Controle de Manutenção)

**Permissões:**

- ✅ Ver dashboard
- ✅ Criar e editar despesas de manutenção
- ✅ Ver histórico de manutenções
- ✅ Agendar manutenções futuras
- ✅ Adicionar notas técnicas
- ❌ Não pode criar voos
- ❌ Acesso limitado a despesas não relacionadas à manutenção

**Uso Recomendado:** Equipe de manutenção, mecânicos, hangar

---

## 4. Gestão de Aeronaves

### Criar Nova Aeronave

**Acesso:** Dashboard > Role até o final > Painel de Edição > "Criar Nova Aeronave"

**Campos Obrigatórios:**

1. **Matrícula:** Identificação única (ex: PT-ABC, N12345)
2. **Modelo:** Modelo da aeronave (ex: Cessna 172, Cirrus SR22)
3. **Fabricante:** Fabricante (ex: Cessna, Cirrus, Piper)
4. **Ano de Fabricação:** Ano de produção

**Campos Opcionais:**

- **Status:** ACTIVE, MAINTENANCE, INACTIVE
- **Horas Totais:** Total de horas já voadas (Hobbs)
- **Próxima Manutenção:** Data prevista
- **Notas:** Observações gerais

**Exemplo:**

```
Matrícula: PT-XYZ
Modelo: Cirrus SR22
Fabricante: Cirrus Aircraft
Ano: 2020
Status: ACTIVE
Horas Totais: 1.245,5
Próxima Manutenção: 15/12/2025
Notas: Motor recém revisado (500h)
```

### Editar Aeronave

1. No Dashboard, localize a aeronave
2. Clique no ícone de edição (✏️)
3. Modifique os campos desejados
4. Salve as alterações

### Desativar Aeronave

Para aeronaves fora de operação:

1. Edite a aeronave
2. Mude o Status para "INACTIVE"
3. Adicione motivo nas notas
4. Salve

---

## 5. Registro de Voos

### Criar Novo Voo

**Acesso:** Dashboard > Painel de Edição > "Criar Novo Voo"

**Informações Básicas:**

1. **Data do Voo:** Data e hora de partida
2. **Aeronave:** Selecione da lista
3. **Piloto:** Selecione o piloto responsável
4. **Origem:** Aeroporto/aeródromo de partida (ICAO/IATA)
5. **Destino:** Aeroporto/aeródromo de chegada

**Dados de Combustível:**

- **Combustível Inicial:** Litros no início do voo
- **Combustível Final:** Litros ao término do voo
- **Consumo:** Calculado automaticamente

**Dados Operacionais:**

- **Duração:** Horas em formato decimal (ex: 1.5 = 1h30min)
- **Horas Hobbs:** Leitura inicial e final do Hobbs
- **Absorção de Base:** Valor de taxa de base do aeródromo
- **Impostos e Taxas:** Valores adicionais (navegação, pouso, etc.)

**Custos Associados:**

- **Despesas de Viagem:** Alimentação, hospedagem, transporte
- **Manutenção em Rota:** Reparos ou ajustes durante a viagem

**Documentação:**

- **Upload de Anexos:** PDFs, imagens (plano de voo, recibos)
- **Notas:** Observações sobre o voo

**Exemplo Completo:**

```
Data: 20/11/2025 09:00
Aeronave: PT-XYZ (Cirrus SR22)
Piloto: João Silva
Origem: SBSP (São Paulo/Congonhas)
Destino: SBRJ (Rio de Janeiro/Santos Dumont)

Combustível Inicial: 180 L
Combustível Final: 120 L
Consumo: 60 L

Duração: 1.2 horas
Hobbs Inicial: 1245.5
Hobbs Final: 1246.7

Absorção de Base: R$ 350,00
Impostos/Taxas: R$ 180,00
Despesas de Viagem: R$ 150,00 (almoço)
Manutenção em Rota: R$ 0,00

Notas: Voo tranquilo, céu claro, sem intercorrências
```

### Editar Voo

1. Localize o voo na lista "Voos Recentes"
2. Clique no ícone de edição
3. Modifique os campos necessários
4. Salve

**Permissões:**

- ADMIN: Pode editar qualquer voo
- CONTROLLER: Pode editar qualquer voo
- PILOT: Pode editar apenas voos que pilotou

### Deletar Voo

⚠️ **Atenção:** Ação irreversível!

1. Clique no ícone de exclusão (🗑️)
2. Confirme a exclusão
3. O voo será removido permanentemente

**Permissões:** Apenas ADMIN e CONTROLLER

---

## 6. Controle de Despesas

### Categorias de Despesas

O sistema organiza despesas em categorias pré-definidas:

1. **FUEL (Combustível)**
   - Abastecimentos
   - Combustível de solo

2. **MAINTENANCE (Manutenção)**
   - Manutenções preventivas
   - Manutenções corretivas
   - Inspeções regulares

3. **HANGAR (Hangaragem)**
   - Aluguel de hangar
   - Estacionamento de aeronaves

4. **INSURANCE (Seguro)**
   - Prêmios de seguro
   - Renovações

5. **CREW (Tripulação)**
   - Salários de pilotos
   - Diárias
   - Treinamentos

6. **AIRPORT_FEES (Taxas Aeroportuárias)**
   - Pouso
   - Decolagem
   - Navegação
   - Estacionamento

7. **OTHER (Outros)**
   - Despesas diversas não categorizadas

### Criar Nova Despesa

**Acesso:** Dashboard > Painel de Edição > "Criar Nova Despesa"

**Campos:**

1. **Data da Despesa:** Quando ocorreu
2. **Categoria:** Selecione da lista
3. **Valor:** Valor em reais (R$)
4. **Descrição:** Detalhamento da despesa
5. **Responsável pelo Pagamento:** Quem pagou (opcional)
6. **Voo Relacionado:** Vincule a um voo específico (opcional)
7. **Notas:** Observações adicionais

**Exemplo:**

```
Data: 20/11/2025
Categoria: MAINTENANCE
Valor: R$ 3.500,00
Descrição: Troca de óleo e filtro - 100h
Responsável: José Carlos
Voo Relacionado: (nenhum)
Notas: Realizado na oficina homologada XYZ
```

### Vincular Despesa a Voo

Quando uma despesa está diretamente relacionada a um voo:

1. Crie ou edite a despesa
2. No campo "Voo Relacionado", selecione o voo
3. A despesa aparecerá nos detalhes do voo

**Benefícios:**

- Rastreabilidade completa
- Cálculo preciso de custo por voo
- Relatórios mais detalhados

---

## 7. Divisão de Custos

### Conceito

O Air X Control calcula automaticamente a divisão proporcional de custos entre coproprietários baseado em:

- Percentual de participação de cada um
- Horas voadas por cada proprietário
- Custos fixos vs. variáveis
- Período selecionado

### Como Funciona

**Custos Fixos (divididos proporcionalmente):**

- Hangaragem
- Seguro
- Salários fixos

**Custos Variáveis (divididos por uso):**

- Combustível
- Manutenção por hora
- Taxas aeroportuárias

### Visualização no Dashboard

Na seção "Divisão por Coproprietário":

```
┌─────────────────────────────────────────────────┐
│ João Silva (50%)                                │
│ Horas voadas: 12.5h                             │
│ A pagar: R$ 18.750,00                           │
│                                                 │
│ Carlos Santos (30%)                             │
│ Horas voadas: 6.0h                              │
│ A pagar: R$ 9.450,00                            │
│                                                 │
│ Maria Oliveira (20%)                            │
│ Horas voadas: 3.5h                              │
│ A pagar: R$ 5.800,00                            │
└─────────────────────────────────────────────────┘
```

### Exportar Divisão

1. Selecione o período desejado
2. Clique em "Exportar Divisão de Custos"
3. Será gerado um relatório detalhado em Excel

---

## 8. Gerenciamento de Usuários

### Criar Novo Usuário

**Método 1: Via Cadastro Público (se habilitado)**

1. Acesse `/register`
2. Usuário preenche o formulário
3. Admin aprova e define o papel

**Método 2: Via Script (Recomendado)**

Execute no terminal:

```bash
cd "/Users/josecarneiro/Desktop/Air X Control"
node scripts/create-admin-user.mjs
```

Edite o script para diferentes papéis:

```javascript
role: 'VIEWER',  // Para coproprietário
role: 'PILOT',   // Para piloto
role: 'CTM',     // Para manutenção
```

### Alterar Papel de Usuário

**Via Prisma Studio (Local):**

1. Execute: `npx prisma studio`
2. Abra a tabela "User"
3. Encontre o usuário
4. Edite o campo "role"
5. Salve

**Via Painel Admin (Em breve):**

1. Acesse `/admin`
2. Lista de usuários
3. Clique em editar
4. Selecione novo papel
5. Salve

### Desativar Usuário

Para impedir acesso temporário sem deletar:

1. Encontre o usuário
2. Mude "status" para "INACTIVE"
3. Usuário não conseguirá mais fazer login

### Deletar Usuário

⚠️ **Cuidado:** Remove permanentemente!

1. No Prisma Studio ou painel admin
2. Delete o registro
3. Todos os dados vinculados serão perdidos

---

## 9. Relatórios e Exportação

### Tipos de Relatórios

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

### Exportar Dados

**Formato Excel (.xlsx):**

1. Selecione o período no Dashboard
2. Clique em "Exportar"
3. Escolha o tipo de relatório
4. Download automático

**Formato PDF:**

1. Use a função de impressão do navegador
2. Selecione "Salvar como PDF"
3. Ajuste margens e orientação

### Relatórios Automáticos (Em breve)

- Relatório mensal enviado por email
- Alertas de manutenção
- Resumo de custos semanais

---

## 10. Solução de Problemas

### Não Consigo Fazer Login

**Problema:** "Credenciais inválidas"

**Soluções:**

1. Verifique se o email está correto
2. Confirme se a senha inclui caracteres especiais
3. Tente resetar a senha
4. Verifique se sua conta está ACTIVE

### Dashboard Não Carrega

**Soluções:**

1. Limpe cache do navegador (Ctrl+Shift+Delete)
2. Tente em modo anônimo
3. Verifique conexão com internet
4. Contate o administrador

### Dados Não Aparecem

**Soluções:**

1. Verifique o filtro de período
2. Confirme se há dados cadastrados
3. Verifique suas permissões
4. Recarregue a página (F5)

### Erro ao Criar Voo

**Problema:** Campos obrigatórios

**Soluções:**

1. Preencha todos os campos com *
2. Verifique formato de data (DD/MM/AAAA)
3. Combustível e duração devem ser números
4. Selecione aeronave e piloto das listas

### Não Vejo Painel de Edição

**Causa:** Permissões insuficientes

**Soluções:**

1. Verifique seu papel (role)
2. Apenas ADMIN e CONTROLLER têm acesso
3. Contate administrador para upgrade

---

## Comandos Úteis

### Ver Logs da Aplicação

```bash
doctl apps logs 6e5b8e1d-1872-40b3-9b8d-53c0a542d721 --follow
```

### Acessar Banco de Dados Local

```bash
cd "/Users/josecarneiro/Desktop/Air X Control"
npx prisma studio
```

### Fazer Backup do Banco

```bash
cp prisma/dev.db prisma/dev.db.backup-$(date +%Y%m%d)
```

### Verificar Status da Aplicação

```bash
doctl apps get 6e5b8e1d-1872-40b3-9b8d-53c0a542d721
```

---

## Contato e Suporte

**Email:** suporte@airxcontrol.com  
**Aplicação:** https://air-x-control-9tnmi.ondigitalocean.app  
**Documentação:** https://github.com/zepedrascarneiro/air-x-control

---

**Versão:** 1.0  
**Última Atualização:** Novembro 2025  
**Air X Control** - Gestão Inteligente de Aviação Compartilhada
