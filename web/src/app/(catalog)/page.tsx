export const dynamic = "force-dynamic";

import { CatalogPageHeader } from "@/components/CatalogPageHeader";
import { CatalogGrid } from "@/components/catalog/CatalogGrid";
import { fetchCatalogItems } from "@/lib/catalog-store";

export default async function CatalogHomePage() {
  const catalog = await fetchCatalogItems();

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
