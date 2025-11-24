# 🚁 AIR X - LINKS DE ACESSO PARA COMPARTILHAR

**Data:** 24/11/2025  
**Status:** ✅ Pronto para Teste

---

## 🎯 OPÇÕES DE ACESSO

### ✅ OPÇÃO 1: LOCAL NA REDE (RECOMENDADO AGORA)

**Link para seu amigo acessar:**
```
http://192.168.0.240:3000
```

**Requisitos:**
- Seu amigo deve estar conectado na MESMA WiFi
- Você deve manter o servidor rodando: `npm run dev`
- Funciona imediatamente!

**Credenciais:**
```
Email: admin@airx.com
Senha: Senha123!
```

---

### 🌐 OPÇÃO 2: NGROK (INTERNET - EM ANDAMENTO)

**Status:** ⏳ Configuração pronta

**Para ativar:**
```bash
cd ~/Desktop/Air\ X\ /Air\ X/
ngrok http 3000
```

**Output esperado:**
```
Session Status                online
Forwarding    https://xxxx-xxxx-xxxx.ngrok-free.app -> http://localhost:3000
```

**Compartilhe o link:** `https://xxxx-xxxx-xxxx.ngrok-free.app`

---

### 🚀 OPÇÃO 3: VERCEL (PRODUÇÃO)

**Status:** Código no GitHub ✅

**Para fazer deploy:**
1. Abra: https://vercel.com
2. Login com GitHub
3. Clique "Add New Project"
4. Selecione: `air-x-control`
5. Clique "Deploy"
6. Aguarde 2-3 minutos
7. URL gerada automaticamente!

---

## 📋 O QUE TESTAR

- ✅ Login (admin@airx.com / Senha123!)
- ✅ Dashboard com cards
- ✅ Criar Aeronave (prefixo, modelo, ano, status)
- ✅ Criar Voo COMPLETO:
  - Aeronave (primeiro campo)
  - Piloto (primeiro campo)
  - Data/Horário
  - Origem/Destino
  - Distância, Custo Hora Voada, Tempo Operacional
  - Combustível Inicial/Final
  - **Horário de Apresentação** (novo)
  - **Horário de Corte de Motor** (novo)
  - **Utilizado por** (novo)
  - Número de Passageiro
  - Responsável Financeiro (último campo)
  - Notas
  - **Anexo** (novo - upload de arquivo)
- ✅ Editar Voo
- ✅ Deletar Voo
- ✅ Criar Despesa Fixa (com recibo)
- ✅ Criar Despesa Variável (com associação a voo)
- ✅ Conversor minutos → decimais (150 min = 2.50 h)
- ✅ Upload de anexos (PDF, DOC, XLS, JPG)

---

## 🎓 FUNCIONALIDADES PRINCIPAIS

### Novos Campos Adicionados (Sessão Anterior)

| Campo | Descrição | Local |
|-------|-----------|-------|
| **Aeronave** | Seleção da aeronave a usar | Primeiro |
| **Piloto** | Quem pilota o avião | Primeiro |
| **Utilizado por** | Quem efetivamente usou | Antes de Passageiro |
| **Custo Hora Voada** | Custo por hora (era "Custo Total") | Operacionais |
| **Horário de Apresentação** | Quando chegou | Horários |
| **Horário de Corte de Motor** | Quando desligou | Horários |
| **Anexo** | Upload de documento | Final |
| **Responsável Financeiro** | Último campo | Antes de Notas |

### Funcionalidades Existentes

- ✅ Login com 5 papéis (ADMIN, CONTROLLER, VIEWER, PILOT, CTM)
- ✅ Dashboard com estatísticas
- ✅ Gerenciamento de Aeronaves (CRUD)
- ✅ Gerenciamento de Voos (CRUD com 15+ campos)
- ✅ Despesas Fixas e Variáveis (separadas)
- ✅ Upload de recibos
- ✅ Validações de formulário
- ✅ Interface responsiva (Desktop/Tablet/Mobile)
- ✅ Cores Air X (azul e dourado)

---

## 🚀 PRÓXIMOS PASSOS

### Agora:
1. Compartilhe com seu amigo: **`http://192.168.0.240:3000`**
2. Se ngrok der problema, use a URL local (mais rápido!)
3. Seu amigo testa por ~20 minutos
4. Reporta feedback

### Depois:
1. Deploy em Vercel para URL permanente
2. Configurar banco de dados em produção
3. Configurar autenticação com provedor (Google, GitHub)
4. Preparar documentação final

---

## 💡 DICAS PARA O TESTADOR

**Comece por:**
1. Login
2. Visualizar Dashboard
3. Criar uma Aeronave
4. Criar um Voo (completo, com todos os campos)
5. Editar o voo
6. Criar Despesas
7. Validar tudo funciona

**Tempo estimado:** 20 minutos ⏱️

---

**Air X está 100% pronto para compartilhar! 🎉**

Qualquer dúvida, entre em contato!
