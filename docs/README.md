# Documentação Air X

Mapa dinâmico do projeto, atualizado em Markdown, para leitura rápida e colaboração.

## Sumário

- Visão geral e objetivo: `#overview`
- Stack e decisões: `#stack`
- Mapa de pastas: `#estrutura`
- Modelagem de dados (Prisma): `docs/data-model.md`
- API (endpoints): `docs/api.md`
- Autenticação: `docs/authentication.md`
- Páginas/UX: `docs/ui-pages.md`
- Dashboard (detalhado): `docs/dashboard-overview.md`
- Guia de desenvolvimento: `docs/dev-guide.md`

## Overview {#overview}

Aplicação Next.js 14 para gestão de cotas de aeronaves, com foco em:

- Inteligência operacional (dashboards, próximos voos, histórico)
- Lançamento e controle de despesas/voos
- Autenticação por sessão com cookie HttpOnly

## Stack {#stack}

- Next.js 14 (App Router) + React 18 + TypeScript
- Tailwind CSS (design system leve) e utilitários (`clsx`, `tailwind-merge`)
- Prisma ORM com SQLite (dev)
- Zod + React Hook Form (validação e formulários)

## Estrutura de Pastas {#estrutura}

```text
src/
  app/                # App Router (páginas e APIs)
    api/
      auth/           # Login/Logout/Register
      demo/           # Demo requests
      flights/        # Voos (GET/POST)
    dashboard/        # Painel protegido
    login/            # Página de login
    register/         # Página de cadastro
  components/         # Componentes reutilizáveis
  lib/                # Prisma, auth, validações, utils
prisma/               # Schema e migrations
```

Referências detalhadas:

- `docs/data-model.md` — modelos do Prisma e relacionamentos
- `docs/api.md` — contratos de API (request/response)
- `docs/authentication.md` — fluxo de sessão e cookies
- `docs/ui-pages.md` — páginas e proteção de rotas
- `docs/dev-guide.md` — como rodar, scripts e troubleshooting
