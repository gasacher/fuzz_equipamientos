import Link from "next/link";
import { SalesTable } from "@/components/SalesTable";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function VentasPage() {
  const items = await prisma.sale.findMany({
    orderBy: [{ anio: "desc" }, { mes: "asc" }, { titulo: "asc" }],
  });

  const rows = items.map((s) => ({
    id: s.id,
    historias: s.historias,
    dia: s.dia,
    titulo: s.titulo,
    precioVentaUsd: s.precioVentaUsd,
    porcentajeComision: s.porcentajeComision,
    totalComisionFuzz: s.totalComisionFuzz,
    mes: s.mes,
    comKar: s.comKar,
    comLean: s.comLean,
    comFuzz: s.comFuzz,
    anio: s.anio,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin" className="text-sm text-[#9c9c9c] hover:text-white">
            ← Panel
          </Link>
          <h1 className="fuzz-title mt-2 text-3xl">Ventas</h1>
          <p className="text-sm text-[#9c9c9c]">
            Listado completo con filtros y totales (hoja VENTAS del Excel).
          </p>
        </div>
        <Link href="/admin/ventas/nuevo" className="btn-fuzz">
          + Nueva venta
        </Link>
      </div>
      <SalesTable items={rows} admin />
    </div>
  );
}
