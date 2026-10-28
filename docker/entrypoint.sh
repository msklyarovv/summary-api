#!/bin/sh
set -e

echo "⏳ Применяем миграции БД..."
npx prisma migrate deploy

echo "🚀 Запускаем приложение..."
# Seed выполняется автоматически через SeedService (OnApplicationBootstrap)
exec node dist/main
