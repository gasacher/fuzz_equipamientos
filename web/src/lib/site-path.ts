/** Prefijo para GitHub Pages (/fuzz_equipamientos). Vacío en local. */
export function getBasePath() {
  return process.env.NEXT_PUBLIC_BASE_PATH ?? "";
}

export function withBasePath(path: string) {
  const base = getBasePath();
  if (!path.startsWith("/")) return `${base}/${path}`;
  return `${base}${path}`;
}
