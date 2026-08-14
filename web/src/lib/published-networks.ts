export type PublishedNetworks = {
  instagram: boolean;
  marketplace: boolean;
  mercadoLibre: boolean;
  instagramUrl: string;
};

export type PublishedNetworksSource = {
  ig?: string | null;
  fb?: boolean;
  ml?: boolean;
};

export const PUBLISHED_NETWORK_LABELS = {
  instagram: "Instagram",
  marketplace: "Marketplace",
  mercadoLibre: "Mercado Libre",
} as const;

export function publishedNetworksFromSource(source: PublishedNetworksSource): PublishedNetworks {
  const instagramUrl = source.ig?.trim() ?? "";
  return {
    instagram: !!instagramUrl,
    marketplace: source.fb ?? false,
    mercadoLibre: source.ml ?? false,
    instagramUrl,
  };
}

export function publishedNetworksFromFields(fields: {
  publishedInstagram: boolean;
  publishedMarketplace: boolean;
  publishedMercadoLibre: boolean;
  instagramUrl: string;
}): PublishedNetworks {
  return {
    instagram: fields.publishedInstagram,
    marketplace: fields.publishedMarketplace,
    mercadoLibre: fields.publishedMercadoLibre,
    instagramUrl: fields.instagramUrl.trim(),
  };
}

export function publishedNetworksToDb(
  status: string,
  networks: PublishedNetworks,
): PublishedNetworksSource {
  if (status !== "publicado") {
    return { ig: null, fb: false, ml: false };
  }
  return {
    ig: networks.instagram ? networks.instagramUrl.trim() || null : null,
    fb: networks.marketplace,
    ml: networks.mercadoLibre,
  };
}

export function formatPublishedNetworksDetail(source: PublishedNetworksSource): string {
  const parts: string[] = [];
  const ig = source.ig?.trim();
  if (ig) parts.push(`Instagram: ${ig}`);
  if (source.fb) parts.push("Marketplace");
  if (source.ml) parts.push("Mercado Libre");
  return parts.length ? parts.join(" · ") : "Sin redes indicadas";
}

export function validatePublishedNetworks(
  status: string,
  networks: PublishedNetworks,
): string | null {
  if (status !== "publicado") return null;
  if (networks.instagram && !networks.instagramUrl.trim()) {
    return "Indicá el link de la publicación en Instagram";
  }
  return null;
}

export function enrichTracePublished(
  status: string,
  published: PublishedNetworksSource | null | undefined,
  fallback: PublishedNetworksSource,
): PublishedNetworksSource | null {
  if (status !== "publicado") return null;
  if (published) return published;
  const derived = publishedNetworksToDb("publicado", publishedNetworksFromSource(fallback));
  if (!derived.ig && !derived.fb && !derived.ml) return null;
  return derived;
}

export function publishedNetworksEqual(
  a: PublishedNetworksSource,
  b: PublishedNetworksSource,
): boolean {
  return (
    (a.ig?.trim() || null) === (b.ig?.trim() || null) &&
    !!a.fb === !!b.fb &&
    !!a.ml === !!b.ml
  );
}
