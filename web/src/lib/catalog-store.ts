import type { CatalogItem } from "@/components/catalog/CatalogGrid";
import type { ProductData } from "@/components/catalog/CatalogProduct";
import catalogData from "@/data/catalog.json";

function fromJson(): CatalogItem[] {
  return catalogData.items.map((item) => ({
    id: item.id,
    titulo: item.titulo,
    categoria: item.categoria,
    subcategoria: item.subcategoria,
    marca: item.marca,
    anio: item.anio,
    imageUrl: item.imageUrl,
    valorUsd: item.valorUsd,
  }));
}

function productFromJson(id: string): ProductData | null {
  return catalogData.items.find((item) => item.id === id) ?? null;
}

/** GitHub Pages: solo HTML estático. App completa (local/Railway): base de datos. */
function useStaticCatalog() {
  return process.env.GITHUB_PAGES === "true";
}

export async function fetchCatalogItems(): Promise<CatalogItem[]> {
  if (useStaticCatalog()) {
    return fromJson();
  }

  const { prisma } = await import("@/lib/prisma");
  const { catalogWhere } = await import("@/lib/catalog-visibility");
  const { toCatalogItems } = await import("@/lib/catalog");

  const items = await prisma.instrument.findMany({
    where: catalogWhere,
    orderBy: { titulo: "asc" },
  });

  return toCatalogItems(items);
}

export async function fetchCatalogProduct(id: string): Promise<ProductData | null> {
  if (useStaticCatalog()) {
    return productFromJson(id);
  }

  const { prisma } = await import("@/lib/prisma");
  const { catalogWhere } = await import("@/lib/catalog-visibility");
  const { toProductData } = await import("@/lib/catalog");

  const item = await prisma.instrument.findFirst({
    where: { id, ...catalogWhere },
  });

  return item ? toProductData(item) : null;
}
