#!/bin/bash
set -e

echo "🔧 Gerando Prisma Client..."
npx prisma generate

echo "🗄️ Resetando banco de dados..."
rm -f ./prisma/dev.db ./prisma/dev.db-journal

echo "🗄️ Executando migrations..."
npx prisma migrate deploy

echo "📦 Building Next.js..."
npm run build

echo "✅ Build completo!"
