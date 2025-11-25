# Arquitetura Unificada - Air X Control

## 🎯 Princípio Fundamental

> **Uma API, múltiplos clientes. Uma mudança, todos sincronizados.**

---

## 🏗️ Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                        CAMADA DE CLIENTES                       │
├───────────────┬───────────────┬───────────────┬────────────────┤
│   🌐 Web      │   📱 PWA      │   🍎 iOS      │   🤖 Android   │
│   Browser     │   Instalado   │   App Store   │   Play Store   │
│   Next.js     │   Next.js     │   React Native│   React Native │
└───────┬───────┴───────┬───────┴───────┬───────┴────────┬───────┘
        │               │               │                │
        │  HTTPS        │  HTTPS        │  HTTPS         │  HTTPS
        │               │               │                │
        └───────────────┴───────┬───────┴────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      🔌 API GATEWAY                             │
│                                                                 │
│   Autenticação │ Rate Limiting │ Logging │ CORS │ Versioning   │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      📡 API REST (v1)                           │
│                                                                 │
│   /api/v1/auth/*      - Autenticação (login, logout, register) │
│   /api/v1/aircraft/*  - CRUD de aeronaves                      │
│   /api/v1/flights/*   - CRUD de voos                           │
│   /api/v1/expenses/*  - CRUD de despesas                       │
│   /api/v1/users/*     - Gerenciamento de usuários              │
│   /api/v1/reports/*   - Relatórios e analytics                 │
│   /api/v1/admin/*     - Operações administrativas              │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    🔧 CAMADA DE SERVIÇOS                        │
│                                                                 │
│   AuthService │ FlightService │ ExpenseService │ ReportService │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    💾 CAMADA DE DADOS                           │
│                                                                 │
│                    Prisma ORM                                   │
│                        │                                        │
│                        ▼                                        │
│               ┌─────────────────┐                              │
│               │   PostgreSQL    │                              │
│               │   (DigitalOcean)│                              │
│               └─────────────────┘                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 Contrato da API

### Princípios

1. **RESTful** - Seguir convenções REST
2. **JSON** - Todas as respostas em JSON
3. **Versionada** - `/api/v1/` para permitir evolução
4. **Autenticação** - JWT Bearer Token para apps, Cookie para web
5. **Consistente** - Mesmo formato de resposta sempre

### Formato de Resposta Padrão

```typescript
// Sucesso
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2025-11-25T18:30:00Z",
    "version": "1.0"
  }
}

// Erro
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Campo obrigatório ausente",
    "details": { "field": "email" }
  },
  "meta": {
    "timestamp": "2025-11-25T18:30:00Z",
    "version": "1.0"
  }
}

// Lista com paginação
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  },
  "meta": {
    "timestamp": "2025-11-25T18:30:00Z",
    "version": "1.0"
  }
}
```

---

## 🔐 Autenticação Híbrida

### Para Web (Browser/PWA)

```
Cookie httpOnly + Secure + SameSite=Strict
```

- Mais seguro contra XSS
- Automático (navegador gerencia)
- Funciona com SSR do Next.js

### Para Apps Nativos (iOS/Android)

```
Authorization: Bearer <JWT>
```

- Stateless
- Fácil de gerenciar no app
- Suporta refresh tokens

### Fluxo de Autenticação

```
┌─────────────────────────────────────────────────────────────┐
│                     FLUXO DE LOGIN                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Cliente (Web/App)                    Servidor              │
│       │                                   │                 │
│       │  POST /api/v1/auth/login          │                 │
│       │  { email, password, client }      │                 │
│       │ ─────────────────────────────────>│                 │
│       │                                   │                 │
│       │         Valida credenciais        │                 │
│       │                                   │                 │
│       │  Se client="web":                 │                 │
│       │    Set-Cookie: session=xxx        │                 │
│       │  Se client="mobile":              │                 │
│       │    { accessToken, refreshToken }  │                 │
│       │ <─────────────────────────────────│                 │
│       │                                   │                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 📱 Endpoints da API v1

### Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/v1/auth/login` | Login (retorna token ou cookie) |
| POST | `/api/v1/auth/register` | Criar conta |
| POST | `/api/v1/auth/logout` | Encerrar sessão |
| POST | `/api/v1/auth/refresh` | Renovar token (mobile) |
| GET | `/api/v1/auth/me` | Dados do usuário atual |

### Aeronaves

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/v1/aircraft` | Listar aeronaves |
| GET | `/api/v1/aircraft/:id` | Detalhes de uma aeronave |
| POST | `/api/v1/aircraft` | Criar aeronave |
| PUT | `/api/v1/aircraft/:id` | Atualizar aeronave |
| DELETE | `/api/v1/aircraft/:id` | Remover aeronave |

### Voos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/v1/flights` | Listar voos |
| GET | `/api/v1/flights/:id` | Detalhes de um voo |
| POST | `/api/v1/flights` | Registrar voo |
| PUT | `/api/v1/flights/:id` | Atualizar voo |
| DELETE | `/api/v1/flights/:id` | Remover voo |

### Despesas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/v1/expenses` | Listar despesas |
| GET | `/api/v1/expenses/:id` | Detalhes de uma despesa |
| POST | `/api/v1/expenses` | Criar despesa |
| PUT | `/api/v1/expenses/:id` | Atualizar despesa |
| DELETE | `/api/v1/expenses/:id` | Remover despesa |

### Dashboard/Reports

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/v1/dashboard` | Dados do dashboard |
| GET | `/api/v1/reports/monthly` | Relatório mensal |
| GET | `/api/v1/reports/costs` | Divisão de custos |

### Admin

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/v1/admin/users` | Listar usuários |
| PUT | `/api/v1/admin/users/:id` | Atualizar usuário |
| GET | `/api/v1/admin/demos` | Listar demo requests |
| PUT | `/api/v1/admin/demos/:id` | Atualizar demo |
| GET | `/api/v1/admin/analytics` | Métricas do sistema |

---

## 🔄 Sincronização de Dados

### Estratégia

1. **Fonte Única de Verdade**: O banco PostgreSQL é a única fonte
2. **Clientes são Views**: Web, PWA e Apps apenas exibem dados
3. **Operações via API**: Toda modificação passa pela API
4. **Real-time (Futuro)**: WebSocket para atualizações em tempo real

### Fluxo de Atualização

```
┌────────────────────────────────────────────────────────────────┐
│              SINCRONIZAÇÃO EM TEMPO REAL                       │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│   Usuário A (Web)        Servidor         Usuário B (App)     │
│        │                    │                    │             │
│        │  POST /flights     │                    │             │
│        │ ──────────────────>│                    │             │
│        │                    │                    │             │
│        │                    │  Salva no banco    │             │
│        │                    │                    │             │
│        │  200 OK            │  WebSocket event   │             │
│        │ <──────────────────│───────────────────>│             │
│        │                    │                    │             │
│        │                    │      App atualiza  │             │
│        │                    │      a lista       │             │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Roadmap de Implementação

### Fase 1: Preparação (Atual)

- [x] API básica funcionando
- [ ] Versionamento da API (/api/v1/)
- [ ] PostgreSQL em produção
- [ ] Documentação OpenAPI/Swagger

### Fase 2: PWA

- [ ] Manifest.json
- [ ] Service Worker
- [ ] Modo offline
- [ ] Push notifications

### Fase 3: Autenticação Robusta

- [ ] JWT para mobile
- [ ] Refresh tokens
- [ ] Revogação de tokens
- [ ] Rate limiting

### Fase 4: App Nativo

- [ ] Setup React Native/Expo
- [ ] Telas principais
- [ ] Publicação nas lojas

### Fase 5: Real-time

- [ ] WebSocket server
- [ ] Eventos de atualização
- [ ] Sync offline

---

## 📦 Estrutura de Código Recomendada

```
/src
  /app
    /api
      /v1                    # API versionada
        /auth
          /login/route.ts
          /register/route.ts
          /logout/route.ts
          /refresh/route.ts
          /me/route.ts
        /aircraft
          /route.ts          # GET (list), POST (create)
          /[id]/route.ts     # GET, PUT, DELETE
        /flights
          /route.ts
          /[id]/route.ts
        /expenses
          /route.ts
          /[id]/route.ts
        /dashboard
          /route.ts
        /admin
          /users/route.ts
          /demos/route.ts
          /analytics/route.ts
    /dashboard               # Páginas web
    /admin
    /login
    ...
  
  /lib
    /api                     # Helpers da API
      /response.ts           # Formatador de resposta padrão
      /auth.ts               # Middleware de autenticação
      /validate.ts           # Validação de requests
    /services                # Lógica de negócio
      /auth.service.ts
      /flight.service.ts
      /expense.service.ts
    /prisma.ts
    
  /types
    /api.ts                  # Tipos da API
    /models.ts               # Tipos dos modelos
```

---

## ✅ Checklist de Qualidade

### Antes de Cada Deploy

- [ ] Testes de API passando
- [ ] Resposta segue formato padrão
- [ ] Autenticação funcionando (web e token)
- [ ] Erros retornam mensagens claras
- [ ] Logs adequados
- [ ] Rate limiting ativo

### Para Cada Novo Endpoint

- [ ] Documentação atualizada
- [ ] Validação de input
- [ ] Tratamento de erros
- [ ] Testes automatizados
- [ ] Permissões verificadas

---

**Última atualização:** 25 de Novembro de 2025  
**Versão do documento:** 1.0
