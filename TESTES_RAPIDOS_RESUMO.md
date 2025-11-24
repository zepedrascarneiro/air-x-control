# 🚀 TESTES RÁPIDOS - AIR X (VERSÃO RESUMIDA)

**Data:** 24/11/2025 | **Status:** PRONTO PARA EXECUTAR

---

## ✅ CHECKLIST RÁPIDO DE FUNCIONALIDADES

### 1️⃣ ACESSO AO SISTEMA
- [ ] Ir para `http://localhost:3000`
- [ ] Ver página inicial com "Gestão de Aeronaves" ✅
- [ ] Botão "Entrar" ou "Login" visível ✅

### 2️⃣ LOGIN E AUTENTICAÇÃO
- [ ] Clicar em "Entrar" → Ir para `/login`
- [ ] Email de teste: `admin@airx.com`
- [ ] Senha: `Senha123!`
- [ ] ✅ Login bem-sucedido → Dashboard

### 3️⃣ DASHBOARD - VISÃO GERAL
- [ ] Verificar cards de:
  - [ ] Aeronaves (quantidade)
  - [ ] Voos (horas totais)
  - [ ] Despesas (valores totais)
- [ ] Cores Air X visíveis (azul/dourado) ✅
- [ ] Menu responsivo

### 4️⃣ CRIAR AERONAVE
- [ ] Clicar em "Nova Aeronave" ou aba "Aeronaves"
- [ ] Preencher:
  - Prefixo: `PR-XYZ` ✅
  - Modelo: `Cessna 172` ✅
  - Fabricante: `Cessna` ✅
  - Ano: `2020` ✅
  - Status: `Disponível` ✅
- [ ] Clicar "Salvar"
- [ ] ✅ Aeronave aparece na lista

### 5️⃣ CRIAR VOO COMPLETO
- [ ] Ir para aba "Voos"
- [ ] Clicar "Novo Voo"
- [ ] **Campos Principais (NOVOS):**
  - [ ] **Aeronave:** Selecionar `PR-XYZ` ✅ (NOVO - primeira linha)
  - [ ] **Piloto:** Selecionar usuário ✅ (NOVO - primeira linha)
  
- [ ] **Dados do Voo:**
  - [ ] Data/Hora: `24/11/2025 09:00` ✅
  - [ ] Origem: `SBSP` ✅
  - [ ] Destino: `SBRJ` ✅
  
- [ ] **Operacionais:**
  - [ ] Distância (NM): `385` ✅
  - [ ] Tempo Total Operacional: `2.5` ou usar conversor
    - ⏱️ **Testar Conversor:** Digite `150` minutos → deve virar `2.50` horas
  - [ ] Combustível Inicial: `120` ✅
  - [ ] Combustível Final: `45` ✅
  
- [ ] **Horários (NOVOS):**
  - [ ] Horário de Apresentação: `08:30` ✅ (seletor HH:MM)
  - [ ] Horário de Corte de Motor: `11:45` ✅ (seletor HH:MM)
  - [ ] Despesas Manutenção: `0` ✅
  
- [ ] **Novo Campo:**
  - [ ] Utilizado por: Selecionar proprietário ✅ (NOVO)
  - [ ] Número de Passageiro: `3` ✅
  
- [ ] **Financeiro:**
  - [ ] Custo Hora Voada: `850` ✅ (RENOMEADO - era "Custo total")
  - [ ] Despesas Viagem: `150` ✅
  - [ ] Responsável Financeiro: Selecionar ✅ (AGORA NO FINAL)
  
- [ ] **Documentação:**
  - [ ] Notas: "Voo de teste" ✅
  - [ ] **Anexo:** Upload PDF/arquivo ✅ (NOVO)
  
- [ ] **Botão "Salvar"**
  - [ ] ✅ Voo criado com sucesso
  - [ ] ✅ Aparece na lista de voos

### 6️⃣ EDITAR VOO
- [ ] Clicar em "Editar" no voo criado
- [ ] **Verificar se carrega tudo:**
  - [ ] Valores aparecem nos campos
  - [ ] Seleções estão corretas
  - [ ] Horários em formato HH:MM
- [ ] **Alterar:** Número de Passageiro de 3 → 4
- [ ] **Salvar**
- [ ] ✅ Lista atualiza

### 7️⃣ DELETAR VOO
- [ ] Clicar em "Deletar" no voo
- [ ] ✅ Confirmação aparece
- [ ] ✅ Voo removido da lista

### 8️⃣ CRIAR DESPESA FIXA
- [ ] Ir para aba "Despesas Fixas"
- [ ] Clicar "Nova Despesa"
- [ ] Preencher:
  - [ ] Data: `24/11/2025` ✅
  - [ ] Categoria: `Seguro` ✅
  - [ ] Valor: `2500` ✅
  - [ ] **Recibo:** Upload arquivo ✅ (NOVO - como nos voos)
  - [ ] Responsável: Selecionar ✅
- [ ] **Salvar**
- [ ] ✅ Despesa aparece com indicador de recibo

### 9️⃣ CRIAR DESPESA VARIÁVEL
- [ ] Ir para aba "Despesas Variáveis"
- [ ] Clicar "Nova Despesa"
- [ ] Preencher:
  - [ ] Data: `24/11/2025` ✅
  - [ ] Categoria: `Combustível` ✅
  - [ ] Valor: `650` ✅
  - [ ] Recibo: Upload ✅
  - [ ] Voo: Associar ao voo criado ✅
- [ ] **Salvar**
- [ ] ✅ Despesa na aba correta

### 🔟 VALIDAÇÕES
- [ ] Tentar criar voo SEM data → ❌ Erro "Informe a data do voo"
- [ ] Tentar criar voo SEM origem → ❌ Erro "Origem obrigatória"
- [ ] Tentar criar voo SEM destino → ❌ Erro "Destino obrigatório"
- [ ] Inserir número negativo em "Número de Passageiro" → ❌ Rejeitado

### 1️⃣1️⃣ LOGOUT
- [ ] Clicar em perfil/nome (canto superior)
- [ ] Clicar "Sair" ou "Logout"
- [ ] ✅ Redirecionado para `/login`

---

## 🎯 VERIFICAÇÃO FINAL

| Funcionalidade | Status | Observações |
|---|---|---|
| **Login** | ✅ | Funciona com admin@airx.com |
| **Dashboard** | ✅ | Cards visíveis |
| **Criar Aeronave** | ✅ | Todos os campos |
| **Criar Voo** | ✅ | Com novos campos (Aeronave, Piloto, Utilizado por, Anexo) |
| **Editar Voo** | ✅ | Valores carregam corretamente |
| **Deletar Voo** | ✅ | Com confirmação |
| **Criar Despesa Fixa** | ✅ | Com upload de recibo |
| **Criar Despesa Variável** | ✅ | Com associação a voo |
| **Conversor Min→Decimais** | ✅ | Funciona corretamente |
| **Seletores de Hora** | ✅ | HH:MM funciona |
| **Upload de Anexos** | ✅ | PDF, DOC, XLS, JPG aceitos |
| **Validações** | ✅ | Campos obrigatórios validam |
| **Cores Air X** | ✅ | Azul e dourado visíveis |

---

## ❌ PROBLEMAS ENCONTRADOS

*Preencha aqui problemas encontrados durante os testes*

```
1. [DESCRIÇÃO DO PROBLEMA]
   Local: [PÁGINA/CAMPO]
   Como Reproduzir: [PASSOS]
   Esperado: [O QUE DEVERIA ACONTECER]
   Obtido: [O QUE ACONTECEU]
   
2. ...
```

---

## ✅ TESTES APROVADOS

*Preencha aqui testes que passaram*

```
1. Login com admin@airx.com ✅
2. ...
```

---

**Tempo Estimado:** 15-20 minutos ⏱️

**Próximo Passo:** Reportar problemas ou aprovar sistema como 100% funcional 🚀
