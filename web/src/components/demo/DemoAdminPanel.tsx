import Link from "next/link";
import { AdminHubCards } from "@/components/AdminHubCards";
import { SalesMonthSummary } from "@/components/SalesMonthSummary";
import adminDemo from "@/data/admin-demo.json";
import { panelDemoPath } from "@/lib/panel-demo-path";

export function DemoAdminPanel() {
  const d = adminDemo;

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
        stockTotal={d.stockTotal}
        stockPublished={d.stockPublished}
        salesCount={d.salesCount}
        salesTotalUsd={d.salesTotalUsd}
        salesCommission={d.salesCommission}
        pathPrefix={panelDemoPath()}
      />

      {d.salesCount > 0 && (
        <section className="fuzz-card p-4">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#9c9c9c]">
            Resumen ventas
          </h2>
          <SalesMonthSummary data={d.salesByMonth} pathPrefix={panelDemoPath()} />
        </section>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href={panelDemoPath("/catalogo")} className="fuzz-card block p-4 transition hover:border-[#e50914]">
          <h3 className="font-semibold text-white">Vista catálogo web</h3>
          <p className="mt-1 text-sm text-[#9c9c9c]">
            Previsualizá lo que ven los clientes ({d.stockPublished} ítems)
          </p>
        </Link>
        <div className="fuzz-card p-4">
          <h3 className="font-semibold text-white">Acceso rápido</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="btn-fuzz-outline pointer-events-none text-xs opacity-80">+ Stock</span>
            <span className="btn-fuzz-outline pointer-events-none text-xs opacity-80">+ Venta</span>
          </div>
        </div>
      </div>
    </div>
  );
}
