import type { CatalogItem } from "@/components/catalog/CatalogGrid";
import type { ProductData } from "@/components/catalog/CatalogProduct";
import catalogData from "@/data/catalog.json";

function staticItems(): CatalogItem[] {
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

function staticProduct(id: string): ProductData | null {
  return catalogData.items.find((item) => item.id === id) ?? null;
}

export async function fetchCatalogItems(): Promise<CatalogItem[]> {
  if (process.env.GITHUB_PAGES === "true") {
    return staticItems();
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
  if (process.env.GITHUB_PAGES === "true") {
    return staticProduct(id);
  }

  const { prisma } = await import("@/lib/prisma");
  const { catalogWhere } = await import("@/lib/catalog-visibility");
  const { toProductData } = await import("@/lib/catalog");

  const item = await prisma.instrument.findFirst({
    where: { id, ...catalogWhere },
  });

  return item ? toProductData(item) : null;
}
