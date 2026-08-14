#!/bin/bash
# Demo local del panel FUZZ

set -e
cd "$(dirname "$0")/web"

echo "============================================"
echo "  FUZZ — DEMO LOCAL"
echo ""
echo "  Panel:  http://localhost:3000/panel"
echo "  Login:  http://localhost:3000/login"
echo "          admin@fuzz.com / admin123"
echo "============================================"
echo ""

pkill -f "next dev" 2>/dev/null || true
pkill -f "next start" 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
sleep 1

if [ ! -d "node_modules" ]; then
  npm install
fi

npx prisma generate

echo "→ Compilando (puede tardar ~1 min)…"
npm run build

echo "→ Arrancando servidor…"
npm run start &
SERVER_PID=$!

for i in $(seq 1 45); do
  if curl -sf "http://localhost:3000/panel" >/dev/null 2>&1; then
    echo "✓ Listo en http://localhost:3000/panel"
    open "http://localhost:3000/panel" 2>/dev/null || true
    wait $SERVER_PID
    exit 0
  fi
  sleep 2
done

echo "Error: el servidor no respondió. Revisá la terminal."
kill $SERVER_PID 2>/dev/null || true
exit 1
