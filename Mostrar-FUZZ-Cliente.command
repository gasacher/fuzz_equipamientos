#!/bin/bash
# Demo COMPLETA para el cliente (siempre recompila sin GitHub Pages)

set -e
cd "$(dirname "$0")/web"

export WATCHPACK_POLLING=true
export CHOKIDAR_USEPOLLING=true

echo "============================================"
echo "  FUZZ — DEMO COMPLETA"
echo "  Login:  http://localhost:3000/login"
echo "  Email:  admin@fuzz.com"
echo "  Clave:  admin123"
echo "============================================"
echo ""

pkill -f "next dev" 2>/dev/null || true
pkill -f "next start" 2>/dev/null || true
sleep 1

if [ ! -d "node_modules" ]; then
  npm install
fi

if [ ! -f "dev.db" ]; then
  npx prisma generate
  npm run db:setup
fi

echo "→ Compilando app completa (catálogo + login + admin)..."
rm -rf .next
unset GITHUB_PAGES
unset NEXT_PUBLIC_BASE_PATH
npm run build

open "http://localhost:3000/login" 2>/dev/null || true
echo "→ Listo. No cierres esta ventana."
exec npm run start
