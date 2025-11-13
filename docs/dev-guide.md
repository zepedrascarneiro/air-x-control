# Guia de Desenvolvimento

## Pré-requisitos

- Node.js 18+
- npm

## Setup rápido

```bash
npm install
npm run prisma:generate
npx prisma migrate dev --name init
npm run dev
```

Acesse <http://localhost:3000>.

## Scripts

- `npm run dev` — inicia dev server
- `npm run lint` — executa ESLint
- `npm run build` — build de produção
- `npm run start` — start em produção (após build)
- `npm run prisma:generate` — gera o client Prisma
- `npm run prisma:migrate` — aplica migrations (deploy)
- `npm run test:e2e` — executa testes end-to-end (Playwright)
- `npm run test:e2e:headed` — executa e2e em modo interativo
- `npm run test:e2e:report` — abre o relatório mais recente

## Banco de dados

- Variável `DATABASE_URL` via `.env`. Exemplo (SQLite dev):

  ```env
  DATABASE_URL="file:./prisma/dev.db"
  ```

- Migrações: `npx prisma migrate dev --name <nome>` (dev) / `npm run prisma:migrate` (deploy)
- Studio (opcional): `npx prisma studio`

## Troubleshooting

- Lint falhando por regras do ESLint/MD: ajuste blocos de código com linguagem e linhas em branco.
- Prisma travando por servidor em execução: pare o `next dev` antes de migrar.
- Porta 3000 em uso: exporte `PORT=3001` e rode `npm run dev`.

## Testes end-to-end

1. Instale os navegadores do Playwright (apenas uma vez):

  ```bash
  npx playwright install
  ```

1. Garanta que o usuário de testes esteja populado:

  ```bash
  npm run seed:editor
  ```

1. Rode os testes:

  ```bash
  npm run test:e2e
  ```

Por padrão o Playwright inicia o Next.js em `http://127.0.0.1:3000`. Para reutilizar um servidor já rodando, exporte `PLAYWRIGHT_BASE_URL` antes de executar os testes.
