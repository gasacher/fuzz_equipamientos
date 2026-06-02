# FUZZ Equipamientos

Catálogo web público + panel admin (stock, ventas, importación Excel).

## Catálogo online (GitHub Pages)

**https://gasacher.github.io/fuzz_equipamientos/**

En el repo de GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

Cada push a `main` publica el catálogo público (sin panel admin; el admin sigue siendo local).

## Demo local (Mac)

Doble clic en **`Iniciar-FUZZ.command`** → http://localhost:3000

Más detalle: [LEEME-LOCAL.txt](LEEME-LOCAL.txt)

## Desarrollo

Todo está en [`web/`](web/). Ver [web/README.md](web/README.md).

```bash
cd web
cp .env.example .env
npm install
npx prisma generate
npm run db:setup
npm run refresh   # build + servidor estable
```

- **Catálogo:** http://localhost:3000  
- **Admin:** http://localhost:3000/login (`admin@fuzz.com` / `admin123` — cambiar en producción)

## Contenido del repo

| Archivo / carpeta | Uso |
|-------------------|-----|
| `web/` | Aplicación Next.js |
| `FUZZEQUIPAMIENTOS - ADMIN.xlsx` | Datos para importar (stock + ventas) |
| `Iniciar-FUZZ.command` | Arranque local en un clic (macOS) |
