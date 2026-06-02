import Link from "next/link";
import { formatUsd, type MonthSalesStat } from "@/lib/sales-stats";

type Props = {
  data: MonthSalesStat[];
  showLink?: boolean;
};

/** Meses con nombre (excluye "SIN MES" del Excel). */
function monthsWithLabel(data: MonthSalesStat[]) {
  return data.filter((d) => d.mes !== "SIN MES" && d.count > 0);
}

export function SalesMonthSummary({ data, showLink = true }: Props) {
  const months = monthsWithLabel(data);
  const sinMes = data.find((d) => d.mes === "SIN MES");
  const totalVentas = data.reduce((s, d) => s + d.ventasUsd, 0);
  const totalComision = data.reduce((s, d) => s + d.comisionFuzz, 0);
  const totalCount = data.reduce((s, d) => s + d.count, 0);

  if (totalCount === 0) {
    return (
      <p className="text-sm text-[#9c9c9c]">
        Sin ventas cargadas.{" "}
        <Link href="/admin/ventas" className="text-[#e50914] hover:underline">
          Ir a ventas
        </Link>
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-[#9c9c9c]">
          <span className="text-white">{totalCount}</span> ventas ·{" "}
          <span className="text-white">{formatUsd(totalVentas)}</span> · Com. FUZZ{" "}
          <span className="text-white">{formatUsd(totalComision)}</span>
        </p>
        {showLink && (
          <Link href="/admin/ventas" className="text-xs text-[#e50914] hover:underline">
            Ver listado →
          </Link>
        )}
      </div>

      {months.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {months.map((d) => (
            <div
              key={d.mes}
              className="rounded-lg border border-[#1c1c1c] bg-[#0f0f0f] px-3 py-2"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#e50914]">
                {d.mes}
              </p>
              <p className="mt-0.5 text-base font-semibold text-white">{formatUsd(d.ventasUsd)}</p>
              <p className="text-[11px] text-[#9c9c9c]">
                {d.count} ops · Com. {formatUsd(d.comisionFuzz)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-[#9c9c9c]">
          Ninguna venta tiene mes asignado en el Excel. Editá el campo &quot;Mes&quot; en cada
          operación.
        </p>
      )}

      {sinMes && sinMes.count > 0 && (
        <p className="text-xs text-[#9c9c9c]">
          + {sinMes.count} ventas sin mes ({formatUsd(sinMes.ventasUsd)}) — ver en{" "}
          <Link href="/admin/ventas" className="text-[#e50914] hover:underline">
            listado completo
          </Link>
        </p>
      )}
    </div>
  );
}
