import type { CatalogItem } from "@/components/catalog/CatalogGrid";
import type { ProductData } from "@/components/catalog/CatalogProduct";
import catalogData from "@/data/catalog.json";
import { prisma } from "@/lib/prisma";
import { catalogWhere } from "@/lib/catalog-visibility";
import { toCatalogItems, toProductData } from "@/lib/catalog";
import type { Instrument } from "@/generated/prisma/client";

const useStaticCatalog = process.env.GITHUB_PAGES === "true";

export async function fetchCatalogItems(): Promise<CatalogItem[]> {
  if (useStaticCatalog) {
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

  const items = await prisma.instrument.findMany({
    where: catalogWhere,
    orderBy: [{ categoria: "asc" }, { titulo: "asc" }],
  });
  return toCatalogItems(items);
}

export async function fetchCatalogProduct(id: string): Promise<ProductData | null> {
  if (useStaticCatalog) {
    const item = catalogData.items.find((i) => i.id === id);
    return item ?? null;
  }

  const product = await prisma.instrument.findFirst({
    where: { id, ...catalogWhere },
  });
  if (!product) return null;
  return toProductData(product as Instrument);
}

export async function fetchCatalogIds(): Promise<string[]> {
  if (useStaticCatalog) {
    return catalogData.items.map((i) => i.id);
  }
  const items = await prisma.instrument.findMany({
    where: catalogWhere,
    select: { id: true },
  });
  return items.map((i) => i.id);
}
