import Link from "next/link";
import { AdminInventarioTable } from "@/components/AdminInventarioTable";
import { prisma } from "@/lib/prisma";

export default async function InventarioPage() {
  const items = await prisma.instrument.findMany({
    orderBy: [{ categoria: "asc" }, { titulo: "asc" }],
  });

  const rows = items.map((i) => ({
    id: i.id,
    titulo: i.titulo,
    categoria: i.categoria,
    subcategoria: i.subcategoria,
    contacto: i.contacto,
    valorUsd: i.valorUsd,
    status: i.status,
    location: i.location,
    ig: i.ig,
    fb: i.fb,
    ml: i.ml,
    visibleInCatalog: i.visibleInCatalog,
    imageUrl: i.imageUrl,
  }));

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="fuzz-title text-3xl">Inventario</h1>
          <p className="mt-2 max-w-xl text-sm text-[#9c9c9c]">
            Estado, ubicación e historial de cada producto. Los cambios al catálogo web son
            automáticos.
          </p>
        </div>
        <Link href="/admin/inventario/nuevo" className="btn-fuzz">
          + Ingresar producto
        </Link>
      </header>

      <AdminInventarioTable items={rows} />
    </div>
  );
}
