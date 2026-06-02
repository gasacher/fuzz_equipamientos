"use client";

import Link from "next/link";
import { CatalogGrid, type CatalogItem } from "@/components/catalog/CatalogGrid";
import adminDemo from "@/data/admin-demo.json";
import { appPath } from "@/lib/site-path";
import { panelDemoPath } from "@/lib/panel-demo-path";

export default function DemoCatalogoPage() {
  const items: CatalogItem[] = adminDemo.catalogItems.map((item) => ({
    id: item.id,
    titulo: item.titulo,
    categoria: item.categoria,
    subcategoria: item.subcategoria,
    marca: item.marca,
    anio: item.anio,
    imageUrl: item.imageUrl,
    valorUsd: item.valorUsd,
  }));

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-[#e50914]/40 bg-[#1a0a0a] px-4 py-3 text-sm text-[#f2f2f2]">
        <strong>Vista previa del catálogo web.</strong> Es lo mismo que ven en{" "}
        <a href={appPath("/catalogo")} target="_blank" rel="noreferrer" className="text-[#e50914] underline">
          el catálogo público
        </a>
        . Cualquier alta, edición o baja en{" "}
        <Link href={panelDemoPath("/inventario")} className="text-[#e50914] underline">
          Inventario
        </Link>{" "}
        se publica acá al guardar. Los ítems en <strong>borrador</strong> no aparecen.
      </div>

      <header>
        <h1 className="fuzz-title text-3xl">Catálogo (vista pública)</h1>
        <p className="mt-2 text-[#9c9c9c]">
          {adminDemo.stockPublished} equipos visibles
          {adminDemo.hiddenCount > 0 &&
            ` · ${adminDemo.hiddenCount} en borrador (solo inventario)`}
        </p>
      </header>

      <CatalogGrid items={items} basePath={appPath("/equipo")} />
    </div>
  );
}
