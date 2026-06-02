# Publicar la app completa (como en local)

## Qué es posible en GitHub

| En GitHub | Qué hace |
|-----------|----------|
| **Repositorio** (`github.com/gasacher/fuzz_equipamientos`) | Guarda **todo** el código: catálogo, admin, login, Excel. Ya está subido. |
| **GitHub Pages** (`gasacher.github.io/fuzz_equipamientos`) | Solo el **catálogo estático**. Sin login, sin base de datos, sin Excel en el servidor. |

No se puede “subir a GitHub Pages” la misma experiencia que `localhost:3000` con login y admin: GitHub Pages no ejecuta Node ni SQLite.

Para ver **login + panel + inventario** en internet hace falta un hosting con servidor (recomendado: **Railway**, gratis para empezar).

---

## Opción recomendada: Railway (app completa)

1. Entrá a [railway.app](https://railway.app) e iniciá sesión con GitHub.
2. **New Project** → **Deploy from GitHub repo** → elegí `fuzz_equipamientos`.
3. En el servicio, **Settings**:
   - **Root Directory:** `web`
   - **Watch Paths:** `web/**` y `FUZZEQUIPAMIENTOS - ADMIN.xlsx`
4. **Variables** (pestaña Variables):

   | Variable | Valor |
   |----------|--------|
   | `DATABASE_URL` | `file:/data/dev.db` |
   | `AUTH_SECRET` | un texto largo aleatorio (no el de demo) |
   | `FUZZ_WHATSAPP` | tu número con código país, ej. `54911…` |

5. **Volume** (almacenamiento persistente para la base):
   - Add Volume → mount path: `/data`
   - Así la SQLite no se borra en cada deploy.

6. **Build Command** (Settings → Build):

   ```bash
   npm ci && npx prisma migrate deploy && npm run db:seed && npm run build
   ```

   (La primera vez crea usuario demo; después podés quitar `db:seed` del build.)

7. **Start Command:**

   ```bash
   npm run start
   ```

8. **Networking** → **Generate Domain** → te dan una URL tipo `https://fuzz-equipamientos-production.up.railway.app`

9. Abrí esa URL:
   - Catálogo: `/`
   - Login: `/login` (`admin@fuzz.com` / `admin123` — **cambiá la contraseña**)

### Importar Excel en Railway

El archivo `FUZZEQUIPAMIENTOS - ADMIN.xlsx` está en la raíz del repo. Con Root Directory `web`, la ruta por defecto `../FUZZEQUIPAMIENTOS - ADMIN.xlsx` funciona. Si no, definí `EXCEL_PATH` en Variables.

---

## Seguir usando GitHub Pages para el catálogo

Podés tener **las dos cosas**:

- **Pages:** catálogo público rápido en `gasacher.github.io/fuzz_equipamientos`
- **Railway:** app completa con admin (otra URL)

Tras cambios en inventario visible en Railway:

```bash
cd web
npm run export:catalog
git add src/data/catalog.json
git commit -m "Actualizar catálogo estático"
git push
```

Eso actualiza GitHub Pages.

---

## Resumen para el cliente

- **Solo comprar / ver precios:** link de GitHub Pages.
- **Gestión interna (stock, ventas, Excel):** URL de Railway o demo en tu Mac con `Iniciar-FUZZ.command`.
