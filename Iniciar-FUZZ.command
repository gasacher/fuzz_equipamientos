#!/bin/bash
# App COMPLETA local: catálogo + login + admin

set -e
cd "$(dirname "$0")/web"

export WATCHPACK_POLLING=true
export CHOKIDAR_USEPOLLING=true

echo "============================================"
echo "  FUZZ — app completa (local)"
echo "  Catálogo: http://localhost:3000"
echo "  Login:    http://localhost:3000/login"
echo "  Admin:    admin@fuzz.com / admin123"
echo "============================================"
echo ""

pkill -f "next dev" 2>/dev/null || true
pkill -f "next start" 2>/dev/null || true
sleep 1

if [ ! -d "node_modules" ]; then
  echo "→ Instalando dependencias..."
  npm install
fi

if [ ! -f "dev.db" ]; then
  echo "→ Creando base de datos..."
  npx prisma generate
  npm run db:setup
fi

# Si .next es del build de GitHub Pages, no hay login/admin → recompilar
if [ -f ".next/BUILD_ID" ] && [ -f ".next/required-server-files.json" ]; then
  if grep -q "fuzz_equipamientos" .next/required-server-files.json 2>/dev/null; then
    echo "→ Detectado build de GitHub Pages; recompilando app completa..."
    rm -rf .next
  fi
fi

NEED_BUILD=0
if [ ! -f ".next/BUILD_ID" ]; then
  NEED_BUILD=1
elif find src public/assets -type f -newer ".next/BUILD_ID" 2>/dev/null | grep -q .; then
  NEED_BUILD=1
fi

if [ "$NEED_BUILD" = "1" ]; then
  echo "→ Compilando app completa (~1-2 min)..."
  unset GITHUB_PAGES
  unset NEXT_PUBLIC_BASE_PATH
  npm run build
fi

open "http://localhost:3000/login" 2>/dev/null || true
echo "→ Servidor en marcha..."
exec npm run start
