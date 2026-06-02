/** Prefijo para GitHub Pages (/fuzz_equipamientos). Vacío en local. */
export function getBasePath() {
  return process.env.NEXT_PUBLIC_BASE_PATH ?? "";
}

/** Catálogo estático en GitHub Pages: sin login, API ni admin. */
export function isStaticCatalogSite() {
  return Boolean(getBasePath());
}

export function withBasePath(path: string) {
  const base = getBasePath();
  if (!path.startsWith("/")) return `${base}/${path}`;
  return `${base}${path}`;
}

/** Rutas para `<Link>`: Next ya aplica `basePath` del config; no duplicar prefijo. */
export function appPath(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const base = getBasePath();
  if (base && normalized.startsWith(base)) {
    const rest = normalized.slice(base.length);
    return rest || "/";
  }
  return normalized;
}
