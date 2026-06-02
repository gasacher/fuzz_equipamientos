import type { CatalogItem } from "@/components/catalog/CatalogGrid";
import type { ProductData } from "@/components/catalog/CatalogProduct";
import catalogData from "@/data/catalog.json";

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
  return staticCatalogItems();
}

export async function fetchCatalogProduct(id: string): Promise<ProductData | null> {
  return catalogData.items.find((i) => i.id === id) ?? null;
}

export async function fetchCatalogIds(): Promise<string[]> {
  return catalogData.items.map((i) => i.id);
}
