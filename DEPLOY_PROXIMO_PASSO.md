# 🚀 Deploy DigitalOcean - Status Atual

## ✅ O que já foi feito (100% pronto!)

### Backend & Build
- ✅ Instaladas todas as dependências npm
- ✅ Prisma Client gerado com sucesso
- ✅ Migrations do banco de dados aplicadas
- ✅ Usuário de teste criado (`editor@airx.dev`)
- ✅ Build de produção testado e compilou sem erros
- ✅ Servidor local rodando em `http://localhost:3000`

### Configuração Deploy
- ✅ Criado `digitalocean/app.yaml` com config completa
- ✅ Atualizado `.env.example` com variáveis corretas
- ✅ GitHub workflow CI/CD está configurado (`.github/workflows/ci.yml`)
- ✅ Commit feito: "🚀 Deploy: Configuração DigitalOcean com app.yaml"
- ✅ Push para GitHub realizado com sucesso

---

## ⚡ O que VOCÊ precisa fazer agora (3 passos simples)

### Passo 1️⃣: Gerar NEXTAUTH_SECRET

Abra o terminal e execute:

```bash
openssl rand -base64 32
```

**Copie o resultado** (será algo como: `aBcDeFgHiJkLmNoPqRsTuVwXyZ0a1B2c3D4E5F6G=`)

---

### Passo 2️⃣: Adicionar Secrets no GitHub

Acesse: **https://github.com/zepedrascarneiro/air-x-control/settings/secrets/actions**

Clique em "New repository secret" e adicione:

**Secret 1:**
- Nome: `DO_API_TOKEN`
- Valor: [Seu token da DigitalOcean]

**Secret 2:**
- Nome: `DO_APP_ID`  
- Valor: [Seu ID da app (algo como `app-xxxxxxxxxxxxx`)]

#### 📍 Como conseguir esses valores:

**DO_API_TOKEN:**
1. Vá para: https://cloud.digitalocean.com/account/api/tokens/new
2. Nome: "GitHub Deploy"
3. Marque "Write (create/update/delete)"
4. Clique "Generate Token"
5. **Copie o token inteiro** (não salva depois!)

**DO_APP_ID:**
1. Vá para: https://cloud.digitalocean.com/apps
2. Clique na sua aplicação "air-x-control"
3. Na URL da página, você vai ver: `app-xxxxxxxxxxxxx`
4. **Copie esse ID**

---

### Passo 3️⃣: Configurar Variáveis de Ambiente no DigitalOcean

Acesse sua aplicação no DigitalOcean:
1. Vá para: https://cloud.digitalocean.com/apps
2. Clique em sua app "air-x-control"
3. Vá para "Settings"
4. Role até "Environment Variables"
5. Clique "Edit"
6. Adicione essas variáveis:

| Variável | Valor |
|----------|-------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | `file:./prisma/dev.db` |
| `ALLOW_SELF_SIGNUP` | `false` |
| `NEXTAUTH_SECRET` | (Cole o que você gerou no Passo 1) |
| `NEXTAUTH_URL` | (Deixe vazio - será preenchido automaticamente) |

**Salve as mudanças!**

---

## 🎬 O que acontece depois

### Deploy Automático
Assim que você adicionar os secrets no GitHub, qualquer push para `main` vai:

1. ✅ Instalar dependências
2. ✅ Rodar lint
3. ✅ Fazer build
4. ✅ Se tudo passar → deploy automático no DigitalOcean

### Visualizar Progresso
- Abra: https://github.com/zepedrascarneiro/air-x-control/actions
- Veja o workflow "CI" em tempo real
- Verde ✅ = Sucesso
- Vermelho ❌ = Erro (veja logs)

---

## 📊 Checklist Final

- [ ] NEXTAUTH_SECRET gerado (comando: `openssl rand -base64 32`)
- [ ] DO_API_TOKEN adicionado nos GitHub Secrets
- [ ] DO_APP_ID adicionado nos GitHub Secrets  
- [ ] Variáveis de ambiente configuradas no DigitalOcean
- [ ] Deploy iniciado (automático ou manual)
- [ ] URL da app copiada (algo como: `https://air-x-xxxxx.ondigitalocean.app`)

---

## 🧪 Depois do Deploy Bem-Sucedido

1. Abra a URL da sua app no navegador
2. Faça login com:
   - Email: `editor@airx.dev`
   - Senha: (a que você configurou) ou crie novo usuário
3. Teste as funcionalidades:
   - Criar aeronave
   - Criar voo
   - Criar despesa
   - Acessar dashboard

---

## 🆘 Se der erro

### "Workflow não inicia"
→ Verifique se DO_API_TOKEN e DO_APP_ID estão nos GitHub Secrets

### "Build fails"
→ Execute localmente: `npm run build` para ver o erro

### "App não inicia no DigitalOcean"
→ Veja logs em: `https://cloud.digitalocean.com/apps/xxxxx/alerts`

### "DATABASE_URL not found"
→ Verifique se a variável foi salva no DigitalOcean

---

## 📞 Próximas Ações

**Me avisa quando:**
1. ✅ Os 3 passos acima estiverem completos
2. ✅ O deploy tiver iniciado
3. ✅ Tiver a URL final da app

**Então eu:**
- Ajudo a testar
- Configuro compartilhamento externo se necessário
- Otimizo performance/segurança
