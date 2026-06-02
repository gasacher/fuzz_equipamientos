import type { CatalogItem } from "@/components/catalog/CatalogGrid";
import type { ProductData } from "@/components/catalog/CatalogProduct";
import catalogData from "@/data/catalog.json";
import { catalogWhere } from "@/lib/catalog-visibility";
import { toCatalogItems, toProductData } from "@/lib/catalog";

const useStaticCatalog = process.env.GITHUB_PAGES === "true";

function staticCatalogItems(): CatalogItem[] {
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

export async function fetchCatalogItems(): Promise<CatalogItem[]> {
  if (useStaticCatalog) return staticCatalogItems();

  const { prisma } = await import("@/lib/prisma");
  const items = await prisma.instrument.findMany({
    where: catalogWhere,
    orderBy: [{ categoria: "asc" }, { titulo: "asc" }],
  });
  return toCatalogItems(items);
}

export async function fetchCatalogProduct(id: string): Promise<ProductData | null> {
  if (useStaticCatalog) {
    return catalogData.items.find((i) => i.id === id) ?? null;
  }

  const { prisma } = await import("@/lib/prisma");
  const product = await prisma.instrument.findFirst({
    where: { id, ...catalogWhere },
  });
  if (!product) return null;
  return toProductData(product);
}

export async function fetchCatalogIds(): Promise<string[]> {
  if (useStaticCatalog) return catalogData.items.map((i) => i.id);

  const { prisma } = await import("@/lib/prisma");
  const items = await prisma.instrument.findMany({
    where: catalogWhere,
    select: { id: true },
  });
  return items.map((i) => i.id);
}
