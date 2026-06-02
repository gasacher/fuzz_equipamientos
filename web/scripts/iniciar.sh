#!/bin/bash
set -e
cd "$(dirname "$0")/.."

echo "→ FUZZ Stock — iniciando en http://localhost:3000"
echo "→ Dejá esta ventana abierta. Para detener: Ctrl+C"
echo ""

export WATCHPACK_POLLING=true
export CHOKIDAR_USEPOLLING=true

# Mata servidores viejos colgados
pkill -f "next dev" 2>/dev/null || true
pkill -f "next start" 2>/dev/null || true

rm -rf .next

exec npx next dev --webpack -p 3000
