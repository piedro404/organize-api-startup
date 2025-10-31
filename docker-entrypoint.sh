#!/bin/sh

echo "🔄 Gerando Prisma Client..."
npx prisma generate

echo "🗄️  Sincronizando banco de dados..."
npx prisma db push --accept-data-loss || true

echo "🚀 Iniciando servidor..."
exec "$@"
