/** Clave de un permalink de Instagram, sin query (img_index) ni barra final. */
export function instagramPermalinkKey(url: string | null | undefined): string | null {
  const trimmed = url?.trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./i, "").toLowerCase();
    const path = parsed.pathname.replace(/\/+$/, "");
    if (!host || path === "" || path === "/") return null;
    return `${host}${path}`;
  } catch {
    return null;
  }
}

/** Índice 1-based de `img_index`, si el permalink lo trae. No forma parte de la clave. */
export function instagramImageIndex(url: string | null | undefined): number | null {
  const trimmed = url?.trim();
  if (!trimmed) return null;
  try {
    const raw = new URL(trimmed).searchParams.get("img_index");
    if (!raw || !/^[0-9]+$/.test(raw)) return null;
    const index = Number(raw);
    if (index < 1 || index > INSTAGRAM_CHILD_LIMIT) return null;
    return index;
  } catch {
    return null;
  }
}

/** Tope de fotos hijas de un carrusel (Instagram permite hasta 10). */
export const INSTAGRAM_CHILD_LIMIT = 10;

/** URL de imagen para un media de la Graph API. null si no hay foto usable. */
export function instagramMediaImageUrl(media: {
  media_type?: string | null;
  media_url?: string | null;
  thumbnail_url?: string | null;
}): string | null {
  const type = media.media_type?.trim().toUpperCase();
  const candidate =
    type === "VIDEO"
      ? media.thumbnail_url
      : type === "IMAGE" || type === "CAROUSEL_ALBUM"
        ? media.media_url
        : null;
  const url = candidate?.trim() ?? "";
  if (!url.startsWith("https://")) return null;
  return url;
}

/**
 * Foto de Instagram solo si el instrumento no tiene imagen propia.
 * Devuelve null para dejar imageUrl como está.
 */
export function instagramFallbackImage(
  imageUrl: string | null | undefined,
  igUrl: string | null | undefined,
  imagesByPermalink: ReadonlyMap<string, string>,
): string | null {
  if (imageUrl?.trim()) return null;
  const key = instagramPermalinkKey(igUrl);
  if (!key) return null;
  return imagesByPermalink.get(key) ?? null;
}

/** Caption solo si el instrumento no tiene descripción propia. No pisa la guardada. */
export function instagramFallbackCaption(
  descripcion: string | null | undefined,
  caption: string | null | undefined,
): string | null {
  if (descripcion?.trim()) return null;
  const text = caption?.trim() ?? "";
  return text || null;
}

function httpsUrls(urls: readonly string[]): string[] {
  const seen = new Set<string>();
  const photos: string[] = [];
  for (const url of urls) {
    const value = url.trim();
    if (!value.startsWith("https://") || seen.has(value)) continue;
    seen.add(value);
    photos.push(value);
    if (photos.length >= INSTAGRAM_CHILD_LIMIT) break;
  }
  return photos;
}

/**
 * Portada de la tarjeta. null si ya hay imageUrl o si el post no tiene foto.
 * Con varias fotos, `img_index` elige cuál; si no entra, usa la primera.
 */
export function instagramCoverChoice(
  imageUrl: string | null | undefined,
  postPhotoUrls: readonly string[],
  imgIndex: number | null,
): string | null {
  if (imageUrl?.trim()) return null;
  const urls = httpsUrls(postPhotoUrls);
  if (urls.length === 0) return null;
  if (imgIndex != null && imgIndex <= urls.length) return urls[imgIndex - 1] ?? null;
  return urls[0] ?? null;
}

/**
 * Fotos de la ficha. Vacío si hay una sola: la página se ve como hoy.
 * La imagen propia, si existe, queda primera y no se reemplaza.
 */
export function instagramGallery(
  imageUrl: string | null | undefined,
  postPhotoUrls: readonly string[],
): string[] {
  const seen = new Set<string>();
  const photos: string[] = [];
  const push = (url: string) => {
    if (!url || seen.has(url)) return;
    seen.add(url);
    photos.push(url);
  };

  const own = imageUrl?.trim() ?? "";
  if (own) push(own);
  for (const url of httpsUrls(postPhotoUrls)) {
    if (photos.length >= INSTAGRAM_CHILD_LIMIT + (own ? 1 : 0)) break;
    push(url);
  }
  return photos.length > 1 ? photos : [];
}

/** Slide inicial. Con imagen propia arranca en esa; si no, en img_index. */
export function instagramGalleryStart(
  imageUrl: string | null | undefined,
  galleryLength: number,
  imgIndex: number | null,
): number {
  if (galleryLength <= 1 || imageUrl?.trim()) return 0;
  if (imgIndex != null && imgIndex <= galleryLength) return imgIndex - 1;
  return 0;
}
