const CATEGORY_IMAGES: Record<string, string> = {
  amps: "/assets/catalog/amplificador.jpeg",
  amplificadores: "/assets/catalog/amplificador.jpeg",
  guitarra: "/assets/catalog/guitarra_negra.jpeg",
  guitarras: "/assets/catalog/guitarra_negra.jpeg",
  bajo: "/assets/catalog/bajo.jpeg",
  bajos: "/assets/catalog/bajo.jpeg",
  bateria: "/assets/catalog/bateria.jpeg",
  baterías: "/assets/catalog/bateria.jpeg",
  baterias: "/assets/catalog/bateria.jpeg",
  teclado: "/assets/catalog/piano.jpeg",
  teclados: "/assets/catalog/piano.jpeg",
  piano: "/assets/catalog/piano.jpeg",
  audio: "/assets/catalog/microfono.jpeg",
  microfono: "/assets/catalog/microfono.jpeg",
  micrófonos: "/assets/catalog/microfono.jpeg",
  accesorios: "/assets/catalog/guitarra_roja.jpeg",
};

const DEFAULT_IMAGE = "/assets/catalog/amplificador.jpeg";

function normalizeCategory(categoria: string) {
  return categoria
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

export function getInstrumentImage(categoria: string, imageUrl?: string | null) {
  if (imageUrl?.trim()) return imageUrl.trim();
  const key = normalizeCategory(categoria);
  for (const [pattern, src] of Object.entries(CATEGORY_IMAGES)) {
    if (key.includes(pattern) || pattern.includes(key)) return src;
  }
  return DEFAULT_IMAGE;
}

export function isExternalImage(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}
