#!/bin/bash
set -e

echo "🔧 Gerando Prisma Client..."
npx prisma generate

echo "🗄️ Forçando reset completo do banco..."
rm -rf ./prisma/dev.db ./prisma/dev.db-journal 2>/dev/null || true

echo "🗄️ Criando banco com schema atualizado..."
npx prisma db push --force-reset --accept-data-loss

echo "📦 Building Next.js..."
npm run build

echo "✅ Build completo!"
