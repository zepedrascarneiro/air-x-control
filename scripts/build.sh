#!/bin/bash
set -e

echo "🔧 Gerando Prisma Client..."
npx prisma generate

echo "🗄️ Executando migrations..."
npx prisma migrate deploy

echo "📦 Building Next.js..."
npm run build

echo "✅ Build completo!"
