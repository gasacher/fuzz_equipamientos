import Link from "next/link";
import { CatalogGrid } from "@/components/catalog/CatalogGrid";
import { toCatalogItems } from "@/lib/catalog";
import { catalogWhere } from "@/lib/catalog-visibility";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminCatalogPreviewPage() {
  const [items, hiddenCount] = await Promise.all([
    prisma.instrument.findMany({
      where: catalogWhere,
      orderBy: [{ categoria: "asc" }, { titulo: "asc" }],
    }),
    prisma.instrument.count({ where: { visibleInCatalog: false } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-[#e50914]/40 bg-[#1a0a0a] px-4 py-3 text-sm text-[#f2f2f2]">
        <strong>Vista previa del catálogo web.</strong> Es lo mismo que ven en{" "}
        <a href="/" target="_blank" rel="noreferrer" className="text-[#e50914] underline">
          el sitio público
        </a>
        . Cualquier alta, edición o baja en{" "}
        <Link href="/admin/inventario" className="text-[#e50914] underline">
          Inventario
        </Link>{" "}
        se publica acá al guardar. Los ítems en <strong>borrador</strong> no aparecen.
      </div>

      <header>
        <h1 className="fuzz-title text-3xl">Catálogo (vista pública)</h1>
        <p className="mt-2 text-[#9c9c9c]">
          {items.length} equipos visibles
          {hiddenCount > 0 && ` · ${hiddenCount} en borrador (solo inventario)`}
        </p>
      </header>

      <CatalogGrid items={toCatalogItems(items)} basePath="/equipo" />
    </div>
  );
}
