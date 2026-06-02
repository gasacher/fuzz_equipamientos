# Publicar el catálogo en GitHub Pages

## Configuración en GitHub (una sola vez)

1. Repo → **Settings** → **Pages**
2. **Build and deployment** → **Source:** elegí **Deploy from a branch**
3. **Branch:** `gh-pages` → carpeta **`/ (root)`** → **Save**

La rama `gh-pages` la crea automáticamente el workflow al hacer push a `main`. Si no la ves, esperá 2 minutos a que termine **Actions** y recargá Settings.

## URLs para el cliente

| Página | URL |
|--------|-----|
| Catálogo | https://gasacher.github.io/fuzz_equipamientos/ |
| Panel demo | https://gasacher.github.io/fuzz_equipamientos/panel/ |

## Si ves 404

1. **Actions** → “Deploy catálogo a GitHub Pages” debe estar en **verde**
2. **Settings → Pages** debe decir branch **`gh-pages`**, no “GitHub Actions” ni `main`
3. Esperá 2–5 minutos y recargá con Cmd+Shift+R

## Login / admin real

No va en Pages. Solo en tu Mac (`Mostrar-FUZZ-Cliente.command`) o en Render (ver DEPLOY-COMPLETO.md).
