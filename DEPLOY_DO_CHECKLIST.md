# ✅ Deploy DigitalOcean - Checklist Completo

## O que foi feito até agora ✓

- ✅ Criado arquivo `digitalocean/app.yaml` com configuração correta
- ✅ Atualizado `.env.example` com variáveis necessárias
- ✅ Testado build localmente (compilou com sucesso)
- ✅ Feito commit e push para GitHub
- ✅ Workflow CI/CD ativado (arquivo `.github/workflows/ci.yml` existe)

---

## O que você precisa fazer agora

### 1️⃣ Verificar os Secrets no GitHub

O workflow tenta usar `${{ secrets.DO_API_TOKEN }}` e `${{ secrets.DO_APP_ID }}` mas podem não estar configurados.

**Passos:**
1. Abra: https://github.com/zepedrascarneiro/air-x-control/settings/secrets/actions
2. Procure por:
   - `DO_API_TOKEN` ✓ (se não existir, crie)
   - `DO_APP_ID` ✓ (se não existir, crie)

### 2️⃣ Se os secrets não existem, criar agora

#### Como conseguir DO_API_TOKEN:
1. Vá para: https://cloud.digitalocean.com/account/api/tokens
2. Clique em "Generate New Token"
3. Nome: `GitHub Deploy`
4. Escopo: Marcar "write" para permitir deployments
5. Copie o token

#### Como conseguir DO_APP_ID:
1. Vá para: https://cloud.digitalocean.com/apps
2. Procure pela sua aplicação (deve chamar algo como "air-x-control")
3. Clique na app
4. Na URL, você verá algo como: `https://cloud.digitalocean.com/apps/app-xxxxxxxxxxxxx`
5. O `app-xxxxxxxxxxxxx` é seu DO_APP_ID

#### Adicionar os Secrets no GitHub:
1. Abra: https://github.com/zepedrascarneiro/air-x-control/settings/secrets/actions
2. Clique em "New repository secret"
3. Nome: `DO_API_TOKEN` → Valor: seu token
4. Clique em "New repository secret"
5. Nome: `DO_APP_ID` → Valor: seu app-id

---

## 3️⃣ Configurar Variáveis de Ambiente na DigitalOcean

No App Platform da DigitalOcean, configure estas variáveis de ambiente:

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `NODE_ENV` | `production` | Modo produção |
| `DATABASE_URL` | `file:./prisma/dev.db` | Banco SQLite (pode mudar para PostgreSQL depois) |
| `ALLOW_SELF_SIGNUP` | `false` | Desabilitar auto-registro em produção |
| `NEXTAUTH_SECRET` | (gerar novo) | Gerar com: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Sua URL do DO | Ex: `https://air-x-xxxxx.ondigitalocean.app` |

### Como definir variáveis no App Platform:
1. Vá para sua aplicação no DigitalOcean: https://cloud.digitalocean.com/apps
2. Clique em "Settings"
3. Role para "Environment Variables"
4. Adicione cada variável

---

## 4️⃣ Gerar NEXTAUTH_SECRET

Execute no terminal:
```bash
openssl rand -base64 32
```

Exemplo de saída:
```
aBcDeFgHiJkLmNoPqRsTuVwXyZ0a1B2c3D4E5F6G=
```

Copie esse valor e adicione como `NEXTAUTH_SECRET` no DigitalOcean.

---

## 5️⃣ Disparar o Deploy

Após configurar todos os secrets e variáveis:

**Opção A - Automático (recomendado):**
- Faça qualquer mudança no código e faça push para `main`
- O GitHub Actions vai automaticamente disparar o deploy

**Opção B - Manual (agora):**
```bash
# Após ter DO_API_TOKEN e DO_APP_ID configurados localmente:
cd /Users/josecarneiro/Desktop/Air\ X\ Control
chmod +x scripts/deploy.sh
DO_API_TOKEN="seu-token-aqui" DO_APP_ID="seu-app-id-aqui" scripts/deploy.sh
```

---

## 6️⃣ Monitorar o Deploy

1. Abra GitHub Actions: https://github.com/zepedrascarneiro/air-x-control/actions
2. Procure pelo workflow "CI" com seu commit
3. Veja o status:
   - 🟡 Yellow = Em andamento
   - ✅ Green = Sucesso
   - ❌ Red = Erro (veja logs)

---

## 7️⃣ Após Deploy Bem-Sucedido

1. Vá para sua app no DigitalOcean
2. Copie a URL pública (algo como `https://air-x-xxxxx.ondigitalocean.app`)
3. Acesse e teste com:
   - Email: `editor@airx.dev`
   - Senha: (a que você configurou, ou crie novo usuário)

---

## 🆘 Troubleshooting

### Workflow falha com erro "not found: doctl"
- Isso é esperado em algumas versões. O arquivo `app.yaml` deve corrigir isso.

### "DATABASE_URL not found"
- Verifique se `DATABASE_URL` está configurada nas variáveis de ambiente do DigitalOcean

### "Port 3000 is not listening"
- Verifique se a build e o start estão funcionando localmente: `npm run build && npm run start`

### "Build failed"
- Veja os logs no GitHub Actions para detalhes do erro
- Execute `npm run build` localmente para reproduzir

---

## 📋 Resumo de Passos Rápidos

```bash
# 1. Gerar NEXTAUTH_SECRET
openssl rand -base64 32

# 2. Colar esse valor + DO_API_TOKEN + DO_APP_ID nos GitHub Secrets
# https://github.com/zepedrascarneiro/air-x-control/settings/secrets/actions

# 3. Configurar variáveis no DigitalOcean App Platform
# https://cloud.digitalocean.com/apps

# 4. Fazer push para ativar o deploy automático (já feito!)
# git push origin main (já executado)

# 5. Monitorar em:
# https://github.com/zepedrascarneiro/air-x-control/actions
```

---

**Próximos passos:** Me avisa quando confirmar que:
1. ✅ DO_API_TOKEN está nos GitHub Secrets
2. ✅ DO_APP_ID está nos GitHub Secrets
3. ✅ Variáveis de ambiente estão no DigitalOcean
4. ✅ O deploy iniciou (ou você quer que eu dispare manualmente)
