#!/bin/bash

# 🚀 Script Automático de Deploy DigitalOcean
# Este script vai criar e fazer deploy da sua aplicação automaticamente

set -e

echo "════════════════════════════════════════════════════════════"
echo "🚀 Air X Control - Deploy Automático DigitalOcean"
echo "════════════════════════════════════════════════════════════"
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Diretório do projeto
PROJECT_DIR="/Users/josecarneiro/Desktop/Air X Control"
cd "$PROJECT_DIR"

echo -e "${BLUE}📍 Diretório: $PROJECT_DIR${NC}"
echo ""

# Passo 1: Verificar se doctl está instalado
echo -e "${YELLOW}[1/5] Verificando doctl...${NC}"
if ! command -v doctl &> /dev/null; then
    echo -e "${RED}❌ doctl não encontrado. Instalando...${NC}"
    brew install doctl
else
    echo -e "${GREEN}✅ doctl já instalado${NC}"
fi
echo ""

# Passo 2: Autenticar
echo -e "${YELLOW}[2/5] Autenticação no DigitalOcean${NC}"
echo -e "${BLUE}Por favor, siga estas instruções:${NC}"
echo "1. Abra: https://cloud.digitalocean.com/account/api/tokens/new"
echo "2. Nome do token: 'CLI Air X Deploy'"
echo "3. Marque: 'Write' (permite criar apps)"
echo "4. Clique 'Generate Token'"
echo "5. COPIE o token"
echo ""
echo -e "${YELLOW}Cole o token quando solicitado:${NC}"

doctl auth init

echo -e "${GREEN}✅ Autenticado com sucesso!${NC}"
echo ""

# Passo 3: Verificar se o app.yaml existe
echo -e "${YELLOW}[3/5] Verificando configuração...${NC}"
if [ ! -f "digitalocean/app.yaml" ]; then
    echo -e "${RED}❌ Arquivo digitalocean/app.yaml não encontrado!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Configuração encontrada${NC}"
echo ""

# Passo 4: Criar aplicação
echo -e "${YELLOW}[4/5] Criando aplicação no DigitalOcean...${NC}"
echo -e "${BLUE}Isso pode levar alguns minutos...${NC}"
echo ""

APP_OUTPUT=$(doctl apps create --spec digitalocean/app.yaml --format ID,DefaultIngress --no-header)
APP_ID=$(echo "$APP_OUTPUT" | awk '{print $1}')
APP_URL=$(echo "$APP_OUTPUT" | awk '{print $2}')

echo -e "${GREEN}✅ Aplicação criada com sucesso!${NC}"
echo ""
echo "════════════════════════════════════════════════════════════"
echo -e "${GREEN}🎉 DEPLOY INICIADO!${NC}"
echo "════════════════════════════════════════════════════════════"
echo ""
echo -e "${BLUE}📝 Informações importantes:${NC}"
echo ""
echo -e "App ID: ${YELLOW}$APP_ID${NC}"
echo -e "URL: ${YELLOW}https://$APP_URL${NC}"
echo ""
echo "════════════════════════════════════════════════════════════"
echo ""

# Passo 5: Salvar informações
echo -e "${YELLOW}[5/5] Salvando informações...${NC}"

cat > "$PROJECT_DIR/DEPLOY_INFO.txt" << EOF
# 🚀 Informações do Deploy

## Aplicação
- **App ID**: $APP_ID
- **URL**: https://$APP_URL
- **Data Deploy**: $(date)

## Próximos Passos

### 1. Adicionar Secrets no GitHub

Acesse: https://github.com/zepedrascarneiro/air-x-control/settings/secrets/actions

Adicione estes secrets:

**Secret 1:**
- Nome: \`DO_API_TOKEN\`
- Valor: [o token que você acabou de gerar]

**Secret 2:**
- Nome: \`DO_APP_ID\`
- Valor: \`$APP_ID\`

### 2. Configurar Variáveis de Ambiente

1. Acesse: https://cloud.digitalocean.com/apps/$APP_ID
2. Vá para "Settings" → "Environment Variables"
3. Adicione:

\`\`\`
NODE_ENV = production
DATABASE_URL = file:./prisma/dev.db
ALLOW_SELF_SIGNUP = false
NEXTAUTH_SECRET = $(openssl rand -base64 32)
\`\`\`

4. Salve e a app vai reiniciar automaticamente

### 3. Monitorar Deploy

- GitHub Actions: https://github.com/zepedrascarneiro/air-x-control/actions
- DigitalOcean: https://cloud.digitalocean.com/apps/$APP_ID

### 4. Acessar Aplicação

Depois do deploy concluir (5-10 min):
- URL: https://$APP_URL
- Login: editor@airx.dev
- Senha: (criar novo usuário ou usar seed)

## Comandos Úteis

\`\`\`bash
# Ver logs da aplicação
doctl apps logs $APP_ID

# Ver status
doctl apps get $APP_ID

# Atualizar aplicação
doctl apps update $APP_ID --spec digitalocean/app.yaml
\`\`\`

EOF

echo -e "${GREEN}✅ Informações salvas em DEPLOY_INFO.txt${NC}"
echo ""

# Abrir URLs importantes
echo -e "${BLUE}Abrindo páginas importantes...${NC}"
open "https://github.com/zepedrascarneiro/air-x-control/settings/secrets/actions"
open "https://cloud.digitalocean.com/apps/$APP_ID"
open "https://$APP_URL"

echo ""
echo "════════════════════════════════════════════════════════════"
echo -e "${GREEN}✅ DEPLOY CONCLUÍDO!${NC}"
echo "════════════════════════════════════════════════════════════"
echo ""
echo -e "${YELLOW}📋 Próximas ações:${NC}"
echo "1. Configure os GitHub Secrets (página aberta)"
echo "2. Configure as variáveis de ambiente no DO (página aberta)"
echo "3. Aguarde ~10 min para o primeiro deploy"
echo "4. Acesse: https://$APP_URL"
echo ""
echo -e "${BLUE}📄 Mais detalhes em: DEPLOY_INFO.txt${NC}"
echo ""
