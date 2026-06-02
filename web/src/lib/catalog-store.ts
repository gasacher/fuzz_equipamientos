import type { CatalogItem } from "@/components/catalog/CatalogGrid";
import type { ProductData } from "@/components/catalog/CatalogProduct";
import catalogData from "@/data/catalog.json";

/** Catálogo público: datos estáticos (exportar con `npm run export:catalog`). */
export async function fetchCatalogItems(): Promise<CatalogItem[]> {
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

export async function fetchCatalogProduct(id: string): Promise<ProductData | null> {
  return catalogData.items.find((item) => item.id === id) ?? null;
}
