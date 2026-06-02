# Publicar el catálogo en GitHub Pages

## Configuración en GitHub (solo una vez)

1. Abrí el repo: https://github.com/gasacher/fuzz_equipamientos  
2. **Settings** → menú izquierdo **Pages**  
3. En **Build and deployment** → **Source**, elegí **GitHub Actions** (no “Deploy from a branch”).

No hace falta crear la rama `gh-pages` ni elegir branch/root. Eso solo aplica si publicás con “Deploy from a branch”; este proyecto usa el workflow **Deploy catálogo a GitHub Pages**.

## Primera publicación

1. Subí los cambios a `main` (push).  
2. Pestaña **Actions** → workflow **Deploy catálogo a GitHub Pages** → debe terminar en verde (build + deploy).  
3. La primera vez, GitHub puede pedir aprobar el environment **github-pages** en Actions; aceptalo.  
4. URL del catálogo: **https://gasacher.github.io/fuzz_equipamientos/**

## Si no ves “GitHub Actions” en Source

- El repo tiene que ser **público** (en cuenta gratuita, Pages en privados es limitado), o tener Pages habilitado en el plan.  
- Entrá a **Actions** y activá workflows si GitHub lo pide.  
- Hacé al menos un push a `main` con el archivo `.github/workflows/github-pages.yml`.

## Demo al cliente (mientras tanto)

Usá la app completa en tu Mac: doble clic en **`Iniciar-FUZZ.command`** → http://localhost:3000 (catálogo + admin en `/login`).
