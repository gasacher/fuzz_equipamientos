# FUZZ — Catálogo y admin

## Qué incluye

- **Catálogo público** (`/`): instrumentos en venta, precios USD, consulta por WhatsApp
- **Admin** (`/admin`): inventario, ventas, importación Excel, vista previa del catálogo

## Requisitos

- Node.js 20+
- Excel `../FUZZEQUIPAMIENTOS - ADMIN.xlsx` (carpeta padre del repo)

## Instalación

```bash
cp .env.example .env
# Editá FUZZ_WHATSAPP y AUTH_SECRET en .env

npm install
npx prisma generate
npm run db:setup
```

## Correr en local

| Comando | Cuándo usarlo |
|---------|----------------|
| `npm run refresh` | **Recomendado** — compila y sirve en http://localhost:3000 |
| `npm run dev` | Desarrollo con recarga en caliente |
| `npm run build` + `npm run start` | Producción local |

En macOS también podés usar `../Iniciar-FUZZ.command` desde la raíz del repo.

## Variables de entorno

Ver `.env.example`.

## Credenciales demo (tras `db:setup`)

- Email: `admin@fuzz.com`
- Contraseña: `admin123`

Cambiar antes de mostrar en producción.

## Estructura

```
src/app/(catalog)/   → catálogo público
src/app/admin/       → panel interno
src/app/api/         → API REST
prisma/              → SQLite + migraciones
public/assets/img/   → logo FUZZ
```

## Producción

`npm run build && npm run start`. Para hosting, migrar a PostgreSQL y usar `AUTH_SECRET` fuerte.
