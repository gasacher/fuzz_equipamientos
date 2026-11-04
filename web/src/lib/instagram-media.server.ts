import "server-only";

import { unstable_rethrow } from "next/navigation";
import { connection } from "next/server";
import {
  INSTAGRAM_CHILD_LIMIT,
  instagramCoverChoice,
  instagramFallbackCaption,
  instagramGallery,
  instagramGalleryStart,
  instagramImageIndex,
  instagramMediaImageUrl,
  instagramPermalinkKey,
} from "@/lib/instagram-media";

const GRAPH_VERSION = "v21.0";
const MAX_PAGES = 4;
const MAX_CHILD_LOOKUPS = 30;
const CHILD_CONCURRENCY = 4;
const SUCCESS_TTL_MS = 5 * 60 * 1000;
const FAILURE_TTL_MS = 60 * 1000;
/** Tope de toda la paginación, no de cada página. */
const REQUEST_TIMEOUT_MS = 8_000;

type InstagramMedia = {
  id?: string;
  permalink?: string;
  caption?: string;
  media_url?: string;
  thumbnail_url?: string;
  media_type?: string;
};

type InstagramMediaPage = {
  data?: InstagramMedia[];
  paging?: { next?: string };
};

type CachedPost = {
  id: string;
  coverUrl: string | null;
  caption: string | null;
  isCarousel: boolean;
};

type PostCache = {
  expiresAt: number;
  posts: Map<string, CachedPost>;
};

type ChildCache = {
  expiresAt: number;
  urls: string[];
};

let postCache: PostCache | null = null;
let postInflight: Promise<Map<string, CachedPost>> | null = null;
const childCache = new Map<string, ChildCache>();
const childInflight = new Map<string, Promise<string[]>>();

function envVar(name: string): string {
  return process.env[name]?.trim() ?? "";
}

function isMediaId(value: string): boolean {
  return /^[0-9]{5,20}$/.test(value);
}

/** Solo lectura. Sin token o sin id numérico no se llama a la API. */
function readInstagramConfig(): { token: string; businessId: string } | null {
  const token = envVar("INSTAGRAM_ACCESS_TOKEN");
  const businessId = envVar("INSTAGRAM_BUSINESS_ID");
  if (!token || !isMediaId(businessId)) return null;
  return { token, businessId };
}

function isGraphUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "graph.facebook.com";
  } catch {
    return false;
  }
}

function rememberMedia(posts: Map<string, CachedPost>, media: InstagramMedia) {
  const key = instagramPermalinkKey(media.permalink);
  if (!key || posts.has(key)) return;
  const id = media.id?.trim() ?? "";
  const validId = isMediaId(id);
  const type = media.media_type?.trim().toUpperCase() ?? "";
  posts.set(key, {
    id: validId ? id : "",
    coverUrl: instagramMediaImageUrl(media),
    caption: media.caption?.trim() || null,
    isCarousel: validId && type === "CAROUSEL_ALBUM",
  });
}

async function fetchGraph(url: string, signal: AbortSignal): Promise<unknown | null> {
  if (signal.aborted || !isGraphUrl(url)) return null;
  let response: Response;
  try {
    response = await fetch(url, {
      cache: "no-store",
      redirect: "error",
      signal,
      headers: { Accept: "application/json" },
    });
  } catch (error) {
    unstable_rethrow(error);
    return null;
  }

  if (!response.ok) {
    console.error("[instagram-media] lectura fallida", response.status);
    await response.arrayBuffer().catch(() => undefined);
    return null;
  }

  try {
    return await response.json();
  } catch (error) {
    unstable_rethrow(error);
    return null;
  }
}

async function fetchMediaPages(token: string, businessId: string): Promise<{
  posts: Map<string, CachedPost>;
  ok: boolean;
}> {
  const posts = new Map<string, CachedPost>();
  const params = new URLSearchParams({
    fields: "id,permalink,caption,media_url,thumbnail_url,media_type",
    limit: "50",
    access_token: token,
  });
  let nextUrl: string | null =
    `https://graph.facebook.com/${GRAPH_VERSION}/${businessId}/media?${params}`;
  let ok = false;
  const signal = AbortSignal.timeout(REQUEST_TIMEOUT_MS);

  for (let page = 0; page < MAX_PAGES && nextUrl; page += 1) {
    const body = (await fetchGraph(nextUrl, signal)) as InstagramMediaPage | null;
    if (!body) break;
    ok = true;
    for (const media of body.data ?? []) rememberMedia(posts, media);
    const next = body.paging?.next;
    nextUrl = typeof next === "string" && isGraphUrl(next) ? next : null;
  }

  return { posts, ok };
}

async function loadInstagramPosts(): Promise<Map<string, CachedPost>> {
  const now = Date.now();
  if (postCache && postCache.expiresAt > now) return postCache.posts;

  if (!postInflight) {
    const config = readInstagramConfig();
    postInflight = (async () => {
      try {
        if (!config) return new Map<string, CachedPost>();
        const result = await fetchMediaPages(config.token, config.businessId);
        postCache = {
          posts: result.posts,
          expiresAt: Date.now() + (result.ok ? SUCCESS_TTL_MS : FAILURE_TTL_MS),
        };
        return result.posts;
      } catch (error) {
        unstable_rethrow(error);
        const posts = new Map<string, CachedPost>();
        postCache = { posts, expiresAt: Date.now() + FAILURE_TTL_MS };
        return posts;
      } finally {
        postInflight = null;
      }
    })();
  }

  return postInflight;
}

function childImageUrls(body: InstagramMediaPage | null): string[] {
  const urls: string[] = [];
  for (const media of body?.data ?? []) {
    const src = instagramMediaImageUrl(media);
    if (!src || urls.includes(src)) continue;
    urls.push(src);
    if (urls.length >= INSTAGRAM_CHILD_LIMIT) break;
  }
  return urls;
}

async function fetchCarouselChildren(token: string, mediaId: string, signal: AbortSignal): Promise<string[]> {
  if (!isMediaId(mediaId)) return [];
  const params = new URLSearchParams({
    fields: "media_type,media_url,thumbnail_url",
    limit: String(INSTAGRAM_CHILD_LIMIT),
    access_token: token,
  });
  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${mediaId}/children?${params}`;
  const body = (await fetchGraph(url, signal)) as InstagramMediaPage | null;
  return childImageUrls(body);
}

async function loadChildren(token: string, mediaId: string, signal: AbortSignal): Promise<string[]> {
  const now = Date.now();
  const cached = childCache.get(mediaId);
  if (cached && cached.expiresAt > now) return cached.urls;

  let pending = childInflight.get(mediaId);
  if (!pending) {
    pending = (async () => {
      try {
        const urls = await fetchCarouselChildren(token, mediaId, signal);
        childCache.set(mediaId, {
          urls,
          expiresAt: Date.now() + (urls.length > 0 ? SUCCESS_TTL_MS : FAILURE_TTL_MS),
        });
        return urls;
      } catch (error) {
        unstable_rethrow(error);
        const urls: string[] = [];
        childCache.set(mediaId, { urls, expiresAt: Date.now() + FAILURE_TTL_MS });
        return urls;
      } finally {
        childInflight.delete(mediaId);
      }
    })();
    childInflight.set(mediaId, pending);
  }

  return pending;
}

async function loadChildrenMap(token: string, ids: readonly string[]): Promise<Map<string, string[]>> {
  const map = new Map<string, string[]>();
  const unique = [...new Set(ids)].filter(isMediaId).slice(0, MAX_CHILD_LOOKUPS);
  if (unique.length === 0) return map;

  const signal = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  const queue = [...unique];
  const workers = Array.from({ length: Math.min(CHILD_CONCURRENCY, queue.length) }, async () => {
    while (queue.length > 0 && !signal.aborted) {
      const id = queue.shift();
      if (!id) return;
      map.set(id, await loadChildren(token, id, signal));
    }
  });
  await Promise.all(workers);
  return map;
}

function postPhotos(post: CachedPost, childUrls: readonly string[] | undefined): string[] {
  if (childUrls && childUrls.length > 0) return [...childUrls];
  return post.coverUrl ? [post.coverUrl] : [];
}

/**
 * Completa imageUrl con una foto del post cuando no hay imagen subida.
 * La grilla usa una sola portada. Si falta el token, la API falla o no hay
 * post, devuelve los mismos ítems.
 */
export async function applyInstagramImageFallback<T extends { imageUrl: string | null }>(
  items: T[],
  instagramUrls: readonly (string | null | undefined)[],
): Promise<T[]> {
  try {
    if (envVar("GITHUB_PAGES") === "true") return items;
    const config = readInstagramConfig();
    if (!config) return items;
    const needsFallback = items.some(
      (item, index) => !item.imageUrl?.trim() && instagramPermalinkKey(instagramUrls[index]),
    );
    if (!needsFallback) return items;

    // Con token, la ficha no puede quedar estática: las URLs de la CDN vencen.
    await connection();
    const posts = await loadInstagramPosts();
    if (posts.size === 0) return items;

    const childIds: string[] = [];
    for (let index = 0; index < items.length; index += 1) {
      if (items[index]?.imageUrl?.trim()) continue;
      const post = posts.get(instagramPermalinkKey(instagramUrls[index]) ?? "");
      if (!post?.isCarousel) continue;
      const slide = instagramImageIndex(instagramUrls[index]);
      if ((slide != null && slide > 1) || !post.coverUrl) childIds.push(post.id);
    }
    const children = childIds.length > 0 ? await loadChildrenMap(config.token, childIds) : null;

    let changed = false;
    const next = items.map((item, index) => {
      const key = instagramPermalinkKey(instagramUrls[index]);
      const post = key ? posts.get(key) : undefined;
      if (!post) return item;
      const urls = postPhotos(post, post.isCarousel ? children?.get(post.id) : undefined);
      const cover = instagramCoverChoice(item.imageUrl, urls, instagramImageIndex(instagramUrls[index]));
      if (!cover) return item;
      changed = true;
      return { ...item, imageUrl: cover };
    });
    return changed ? next : items;
  } catch (error) {
    unstable_rethrow(error);
    return items;
  }
}

/**
 * Ficha: portada, todas las fotos del post y el caption si no hay descripción.
 * No escribe la base. Sin token, sin match o si la API falla, devuelve el mismo ítem.
 */
export async function applyInstagramProductFallback<
  T extends { imageUrl: string | null; descripcion: string | null; galleryUrls?: string[]; galleryIndex?: number },
>(item: T, igUrl: string | null | undefined): Promise<T> {
  try {
    if (envVar("GITHUB_PAGES") === "true") return item;
    const config = readInstagramConfig();
    if (!config) return item;
    const key = instagramPermalinkKey(igUrl);
    if (!key) return item;

    await connection();
    const posts = await loadInstagramPosts();
    const post = posts.get(key);
    if (!post) return item;

    const childUrls = post.isCarousel
      ? await loadChildren(config.token, post.id, AbortSignal.timeout(REQUEST_TIMEOUT_MS))
      : undefined;
    const urls = postPhotos(post, childUrls);
    const own = item.imageUrl?.trim() ? item.imageUrl : null;
    const slide = instagramImageIndex(igUrl);
    const cover = instagramCoverChoice(own, urls, slide);
    const caption = instagramFallbackCaption(item.descripcion, post.caption);
    const gallery = instagramGallery(own, urls);
    const galleryIndex = instagramGalleryStart(own, gallery.length, slide);

    let changed = false;
    let next = item;
    if (cover) {
      next = { ...next, imageUrl: cover };
      changed = true;
    }
    if (caption) {
      next = { ...next, descripcion: caption };
      changed = true;
    }
    if (gallery.length > 1) {
      next = { ...next, galleryUrls: gallery, galleryIndex };
      changed = true;
    }
    return changed ? next : item;
  } catch (error) {
    unstable_rethrow(error);
    return item;
  }
}
