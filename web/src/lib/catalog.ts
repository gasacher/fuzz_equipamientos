import type { Instrument } from "@/generated/prisma/client";
import type { CatalogItem } from "@/components/catalog/CatalogGrid";
import type { ProductData } from "@/components/catalog/CatalogProduct";

export function toCatalogItems(items: Instrument[]): CatalogItem[] {
  return items.map((i) => ({
    id: i.id,
    titulo: i.titulo,
    categoria: i.categoria,
    subcategoria: i.subcategoria,
    marca: i.marca,
    anio: i.anio,
    imageUrl: i.imageUrl,
    valorUsd: i.valorUsd,
  }));
}

export function toProductData(item: Instrument): ProductData {
  return {
    id: item.id,
    titulo: item.titulo,
    categoria: item.categoria,
    subcategoria: item.subcategoria,
    marca: item.marca,
    anio: item.anio,
    origen: item.origen,
    descripcion: item.descripcion,
    imageUrl: item.imageUrl,
    ig: item.ig,
    valorUsd: item.valorUsd,
  };
}
