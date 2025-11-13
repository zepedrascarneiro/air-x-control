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
- `scripts/deploy.sh` — helper que instala dependências, roda lint/build e, se estiver configurado, aciona o `doctl apps update` com as credenciais do DigitalOcean

## Documentação

- Mapa do projeto e visão geral: `docs/README.md`
- Modelagem de dados (Prisma): `docs/data-model.md`
- Endpoints de API: `docs/api.md`
- Autenticação: `docs/authentication.md`
- Páginas/UX: `docs/ui-pages.md`
- Dashboard (detalhado): `docs/dashboard-overview.md`

## Integração contínua e deploy

### GitHub Actions (automático)

O workflow em `.github/workflows/ci.yml` roda **automaticamente** em cada push para `main`:

1. Instala dependências
2. Executa lint
3. Roda build
4. **Se tudo passar**, dispara um deploy automático no DigitalOcean App Platform

**Pré-requisitos para ativar o deploy automático:**

- Adicione dois segredos no GitHub (Settings → Secrets and variables → Actions):
  - `DO_API_TOKEN`: seu token de API do DigitalOcean
  - `DO_APP_ID`: o ID da sua aplicação no DigitalOcean

Após adicionar os segredos, qualquer push para `main` que passar no lint e build acionará automaticamente um redeployment no DigitalOcean App Platform.

### Deploy manual

Se preferir rodar localmente, use o helper:

```bash
chmod +x scripts/deploy.sh
DO_API_TOKEN="<token>" DO_APP_ID="<app-id>" scripts/deploy.sh
```

---

Mantemos a documentação em Markdown e atualizada junto com o código para facilitar leitura e evolução do projeto.
