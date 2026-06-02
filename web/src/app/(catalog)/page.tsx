import { CatalogPageHeader } from "@/components/CatalogPageHeader";
import { CatalogGrid } from "@/components/catalog/CatalogGrid";
import { toCatalogItems } from "@/lib/catalog";
import { catalogWhere } from "@/lib/catalog-visibility";
import { prisma } from "@/lib/prisma";

export default async function CatalogHomePage() {
  const items = await prisma.instrument.findMany({
    where: catalogWhere,
    orderBy: [{ categoria: "asc" }, { titulo: "asc" }],
  });

  const catalog = toCatalogItems(items);

  return (
    <div className="space-y-6">
      <CatalogPageHeader />

      {catalog.length === 0 ? (
        <div className="fuzz-card p-8 text-center text-[#9c9c9c]">
          El catálogo se está actualizando. Escribinos por WhatsApp para consultar disponibilidad.
        </div>
      ) : (
        <CatalogGrid items={catalog} />
      )}
    </div>
  );
}
