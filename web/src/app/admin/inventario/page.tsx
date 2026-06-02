import Link from "next/link";
import { InstrumentTable } from "@/components/InstrumentTable";
import { prisma } from "@/lib/prisma";

export default async function InventarioPage() {
  const items = await prisma.instrument.findMany({
    orderBy: [{ categoria: "asc" }, { titulo: "asc" }],
  });

  const rows = items.map((i) => ({
    id: i.id,
    categoria: i.categoria,
    subcategoria: i.subcategoria,
    titulo: i.titulo,
    valorUsd: i.valorUsd,
    valorArg: i.valorArg,
    contacto: i.contacto,
    marca: i.marca,
    anio: i.anio,
    origen: i.origen,
    ig: i.ig,
    visibleInCatalog: i.visibleInCatalog,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin" className="text-sm text-[#9c9c9c] hover:text-white">
            ← Panel
          </Link>
          <h1 className="fuzz-title mt-2 text-3xl">Stock / Inventario</h1>
          <p className="text-sm text-[#9c9c9c]">
            Los cambios se publican al instante en el{" "}
            <Link href="/admin/catalogo" className="text-[#e50914] hover:underline">
              catálogo web
            </Link>{" "}
            que ven los clientes.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
        <Link href="/admin/catalogo" className="btn-fuzz-outline">
          Ver catálogo web
        </Link>
        <Link href="/admin/inventario/nuevo" className="btn-fuzz">
          + Nuevo
        </Link>
        </div>
      </div>
      <InstrumentTable items={rows} showContact showCatalogStatus admin />
    </div>
  );
}
