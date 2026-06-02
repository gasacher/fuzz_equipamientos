import Link from "next/link";

type Props = {
  stockTotal: number;
  stockPublished: number;
  salesCount: number;
  salesTotalUsd: number;
  salesCommission: number;
};

function fmtUsd(n: number) {
  return `$${n.toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;
}

export function AdminHubCards({
  stockTotal,
  stockPublished,
  salesCount,
  salesTotalUsd,
  salesCommission,
}: Props) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Link
        href="/admin/inventario"
        className="hub-card group block rounded-xl border border-[#1c1c1c] bg-[#111] p-6 transition hover:border-[#e50914]"
      >
        <div className="mb-4 flex items-start justify-between">
          <span className="text-3xl" aria-hidden>
            📦
          </span>
          <span className="text-xs font-semibold uppercase tracking-wide text-[#e50914]">Stock</span>
        </div>
        <h2 className="fuzz-title text-2xl text-white">Inventario</h2>
        <p className="mt-2 text-sm text-[#9c9c9c]">
          Alta, edición y catálogo web. {stockPublished} publicados de {stockTotal} en stock.
        </p>
        <p className="mt-4 text-sm font-medium text-[#f2f2f2] group-hover:text-[#e50914]">
          Gestionar stock →
        </p>
      </Link>

      <Link
        href="/admin/ventas"
        className="hub-card group block rounded-xl border border-[#1c1c1c] bg-[#111] p-6 transition hover:border-[#e50914]"
      >
        <div className="mb-4 flex items-start justify-between">
          <span className="text-3xl" aria-hidden>
            📊
          </span>
          <span className="text-xs font-semibold uppercase tracking-wide text-[#e50914]">Ventas</span>
        </div>
        <h2 className="fuzz-title text-2xl text-white">Ventas</h2>
        <p className="mt-2 text-sm text-[#9c9c9c]">
          {salesCount} operaciones · {fmtUsd(salesTotalUsd)} en ventas · {fmtUsd(salesCommission)} comisión
          FUZZ.
        </p>
        <p className="mt-4 text-sm font-medium text-[#f2f2f2] group-hover:text-[#e50914]">
          Gestionar ventas →
        </p>
      </Link>
    </div>
  );
}
