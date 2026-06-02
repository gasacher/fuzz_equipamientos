#!/bin/bash
# Doble clic en Finder para ver FUZZ en http://127.0.0.1:3000

set -e
cd "$(dirname "$0")/web"

export WATCHPACK_POLLING=true
export CHOKIDAR_USEPOLLING=true

echo "============================================"
echo "  FUZZ — servidor local"
echo "  http://localhost:3000"
echo "  Cerrá esta ventana con Ctrl+C para detener"
echo "============================================"
echo ""

# Cerrar instancias viejas
pkill -f "next dev" 2>/dev/null || true
pkill -f "next start" 2>/dev/null || true
sleep 1

if [ ! -d "node_modules" ]; then
  echo "→ Primera vez: instalando dependencias..."
  npm install
fi

if [ ! -f "dev.db" ]; then
  echo "→ Creando base de datos..."
  npx prisma generate
  npm run db:setup
fi

NEED_BUILD=0
if [ ! -f ".next/BUILD_ID" ]; then
  NEED_BUILD=1
elif find src public/assets -type f -newer ".next/BUILD_ID" 2>/dev/null | grep -q .; then
  NEED_BUILD=1
fi
if [ "$NEED_BUILD" = "1" ]; then
  echo "→ Compilando cambios (~1-2 min)..."
  npm run build
fi

echo "→ Abriendo navegador..."
open "http://localhost:3000" 2>/dev/null || true

echo "→ Servidor en marcha..."
exec npm run start
