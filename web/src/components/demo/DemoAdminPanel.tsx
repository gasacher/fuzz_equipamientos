import catalogData from "@/data/catalog.json";
import { formatCatalogPrice } from "@/lib/format-price";

const DEMO_SALES = {
  count: 128,
  totalUsd: 284_500,
  commission: 42_675,
};

export function DemoAdminPanel() {
  const items = catalogData.items;
  const stockTotal = items.length;
  const stockPublished = items.length;
  const sample = items.slice(0, 8);

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-[#e50914]/40 bg-[#1a0a0a] px-4 py-3 text-sm text-[#f2f2f2]">
        <strong className="text-[#e50914]">Vista demo.</strong> Así se ve el panel interno (stock, ventas,
        importación Excel). En la versión operativa hay login, edición y datos en tiempo real.
      </div>

      <header>
        <h1 className="fuzz-title text-3xl">Panel FUZZ</h1>
        <p className="mt-2 text-[#9c9c9c]">
          Gestión de <strong className="text-[#f2f2f2]">stock</strong> y{" "}
          <strong className="text-[#f2f2f2]">ventas</strong> — vista de demostración.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-[#1c1c1c] bg-[#111] p-6">
          <span className="text-xs font-semibold uppercase tracking-wide text-[#e50914]">Stock</span>
          <h2 className="fuzz-title mt-2 text-2xl text-white">Inventario</h2>
          <p className="mt-2 text-sm text-[#9c9c9c]">
            {stockPublished} publicados en catálogo · {stockTotal} ítems en stock.
          </p>
        </div>
        <div className="rounded-xl border border-[#1c1c1c] bg-[#111] p-6">
          <span className="text-xs font-semibold uppercase tracking-wide text-[#e50914]">Ventas</span>
          <h2 className="fuzz-title mt-2 text-2xl text-white">Ventas</h2>
          <p className="mt-2 text-sm text-[#9c9c9c]">
            {DEMO_SALES.count} operaciones · ${DEMO_SALES.totalUsd.toLocaleString("es-AR")} USD · $
            {DEMO_SALES.commission.toLocaleString("es-AR")} comisión FUZZ.
          </p>
        </div>
      </div>

      <section className="fuzz-card overflow-hidden p-0">
        <div className="border-b border-[#1c1c1c] px-4 py-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#9c9c9c]">
            Inventario (muestra)
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0f0f0f] text-xs uppercase text-[#9c9c9c]">
              <tr>
                <th className="px-4 py-2">Título</th>
                <th className="px-4 py-2">Categoría</th>
                <th className="px-4 py-2">USD</th>
                <th className="px-4 py-2">Catálogo</th>
              </tr>
            </thead>
            <tbody>
              {sample.map((item) => (
                <tr key={item.id} className="border-t border-[#1c1c1c]">
                  <td className="px-4 py-2 text-white">{item.titulo}</td>
                  <td className="px-4 py-2 text-[#9c9c9c]">{item.categoria}</td>
                  <td className="px-4 py-2 text-[#e50914]">{formatCatalogPrice(item.valorUsd)}</td>
                  <td className="px-4 py-2 text-[#9c9c9c]">Visible</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="px-4 py-3 text-xs text-[#9c9c9c]">
          + {stockTotal - sample.length} ítems más en el inventario completo.
        </p>
      </section>

      <section className="fuzz-card space-y-3 p-6">
        <h2 className="fuzz-title text-lg">Importar desde Excel</h2>
        <p className="text-sm text-[#9c9c9c]">
          En el sistema real, un clic actualiza <strong>STOCK</strong> y <strong>VENTAS</strong> desde{" "}
          <strong>FUZZEQUIPAMIENTOS - ADMIN.xlsx</strong>.
        </p>
        <span className="inline-block rounded-md border border-[#333] px-4 py-2 text-sm text-[#9c9c9c]">
          Importar Excel (demo)
        </span>
      </section>
    </div>
  );
}
