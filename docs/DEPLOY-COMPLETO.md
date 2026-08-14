# Publicar la app completa (producción)

GitHub Pages **no** puede correr login ni base de datos. Para producción (catálogo + panel admin + stock) usamos **Render** con un disco persistente.

Costo aproximado: **USD 7/mes** (plan Starter). El plan free de Render **no sirve**: se apaga, borra SQLite y no guarda recibos ni contratos.

## 1. Subir el código a `main`

Render publica la rama por defecto del repo (`main`).

## 2. Crear el servicio en Render

1. Entrá a [dashboard.render.com](https://dashboard.render.com) e iniciá sesión con GitHub.
2. **New** → **Blueprint** → elegí el repo `fuzz_equipamientos`.
3. Completá las variables que pide:
   - `FUZZ_WHATSAPP` — número con código país, ej. `54911…`
   - `ADMIN_PASSWORD` — clave del panel (no dejes `admin123`)
   - `APPOINTMENT_NOTIFY_EMAIL` — opcional
4. Aplicá el blueprint (crea el servicio **Starter** + disco de 1 GB en `/data`).
5. Esperá el deploy verde y copiá la URL (`https://fuzz-equipamientos.onrender.com` o similar).

**Login:** `https://TU-URL.onrender.com/login`  
Usuario: `admin@fuzz.com` (o el `ADMIN_EMAIL` que hayas puesto).

La primera vez importa el Excel y crea el admin. Los deploys siguientes **no** vuelven a borrar el stock.

## 3. Qué queda en cada URL

| URL | Qué es |
|-----|--------|
| Render (`*.onrender.com`) | App completa: catálogo, login, admin, clientes, citas |
| GitHub Pages | Catálogo estático de demostración |

## Alternativa: Railway

1. [railway.app](https://railway.app) → **New Project** → repo `fuzz_equipamientos`.
2. Root Directory: dejar vacío (el start entra a `web`).
3. Volume en `/data`.
4. Variables: `DATABASE_URL=file:/data/dev.db`, `UPLOAD_DIR=/data/uploads`, `AUTH_SECRET`, `FUZZ_WHATSAPP`, `ADMIN_PASSWORD`.
5. Build: `cd web && npm ci && npx prisma generate && npm run build`
6. Start: `cd web && npm run start:production`
