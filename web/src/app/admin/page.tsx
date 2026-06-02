import Link from "next/link";
import { AdminHubCards } from "@/components/AdminHubCards";
import { ImportExcelButton } from "@/components/ImportExcelButton";
import { SalesMonthSummary } from "@/components/SalesMonthSummary";
import { aggregateSalesByMonth } from "@/lib/sales-stats";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [stockTotal, stockPublished, salesRows, salesAgg] = await Promise.all([
    prisma.instrument.count(),
    prisma.instrument.count({ where: { visibleInCatalog: true } }),
    prisma.sale.findMany({
      select: {
        mes: true,
        precioVentaUsd: true,
        totalComisionFuzz: true,
      },
    }),
    prisma.sale.aggregate({
      _sum: {
        precioVentaUsd: true,
        totalComisionFuzz: true,
      },
    }),
  ]);

  const salesTotalUsd = salesAgg._sum.precioVentaUsd ?? 0;
  const salesCommission = salesAgg._sum.totalComisionFuzz ?? 0;
  const salesByMonth = aggregateSalesByMonth(salesRows);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="fuzz-title text-3xl">Panel FUZZ</h1>
        <p className="mt-2 text-[#9c9c9c]">
          Elegí qué querés actualizar: <strong className="text-[#f2f2f2]">stock</strong> (inventario y
          catálogo web) o <strong className="text-[#f2f2f2]">ventas</strong> (comisiones y operaciones).
        </p>
      </header>

      <AdminHubCards
        stockTotal={stockTotal}
        stockPublished={stockPublished}
        salesCount={salesRows.length}
        salesTotalUsd={salesTotalUsd}
        salesCommission={salesCommission}
      />

      {salesRows.length > 0 && (
        <section className="fuzz-card p-4">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#9c9c9c]">
            Resumen ventas
          </h2>
          <SalesMonthSummary data={salesByMonth} />
        </section>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/admin/catalogo" className="fuzz-card block p-4 transition hover:border-[#e50914]">
          <h3 className="font-semibold text-white">Vista catálogo web</h3>
          <p className="mt-1 text-sm text-[#9c9c9c]">Previsualizá lo que ven los clientes ({stockPublished} ítems)</p>
        </Link>
        <div className="fuzz-card p-4">
          <h3 className="font-semibold text-white">Acceso rápido</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/admin/inventario/nuevo" className="btn-fuzz-outline text-xs">
              + Stock
            </Link>
            <Link href="/admin/ventas/nuevo" className="btn-fuzz-outline text-xs">
              + Venta
            </Link>
          </div>
        </div>
      </div>

      <section className="fuzz-card space-y-3 p-6">
        <h2 className="fuzz-title text-lg">Importar desde Excel</h2>
        <p className="text-sm text-[#9c9c9c]">
          Actualiza <strong>STOCK</strong> (inventario + catálogo) y <strong>VENTAS</strong> desde{" "}
          <strong>FUZZEQUIPAMIENTOS - ADMIN.xlsx</strong> en la carpeta del proyecto.
        </p>
        <ImportExcelButton />
      </section>
    </div>
  );
}
