#!/bin/sh
set -e
cd "$(dirname "$0")/.."
npx prisma migrate deploy
npm run db:seed
exec npx next start -p "${PORT:-3000}" -H 0.0.0.0
