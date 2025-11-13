# Air X — Gestão de Cotas de Aeronaves

Bem-vindo ao projeto Air X. Este repositório contém um app Next.js focado em dashboards operacionais, agenda de voos e gestão financeira para coproprietários de aeronaves.

- Documentação principal: veja `docs/README.md`
- Stack: Next.js 14 (App Router) + Tailwind CSS + Prisma (SQLite) + TypeScript + Zod + React Hook Form

## Como rodar localmente

1. Configure o banco de dados:
   - Crie um arquivo `.env` na raiz com a variável:

     ```bash
     echo 'DATABASE_URL="file:./prisma/dev.db"' > .env
     ```

   - Rode as migrations e gere o client:

     ```bash
     npm run prisma:generate
     npx prisma migrate dev --name init
     ```

2. Instale dependências e suba o servidor:

  ```bash
  npm install
  npm run dev
  ```

1. Acesse <http://localhost:3000>

## Scripts úteis

- `npm run dev` — inicia o servidor de desenvolvimento
- `npm run build` — build de produção
- `npm run start` — inicia o servidor em produção (após build)
- `npm run lint` — lint com ESLint
- `npm run prisma:generate` — gera o client Prisma
- `npm run prisma:migrate` — aplica migrations (deploy)

## Documentação

- Mapa do projeto e visão geral: `docs/README.md`
- Modelagem de dados (Prisma): `docs/data-model.md`
- Endpoints de API: `docs/api.md`
- Autenticação: `docs/authentication.md`
- Páginas/UX: `docs/ui-pages.md`
- Dashboard (detalhado): `docs/dashboard-overview.md`

---

Mantemos a documentação em Markdown e atualizada junto com o código para facilitar leitura e evolução do projeto.
