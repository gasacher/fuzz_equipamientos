import Link from "next/link";
import { formatUsd, type MonthSalesStat } from "@/lib/sales-stats";

type Props = {
  data: MonthSalesStat[];
  compact?: boolean;
};

function BarChart({
  data,
  valueKey,
  color,
  label,
  compact,
}: {
  data: MonthSalesStat[];
  valueKey: "ventasUsd" | "comisionFuzz";
  color: string;
  label: string;
  compact?: boolean;
}) {
  const max = Math.max(...data.map((d) => d[valueKey]), 1);

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#9c9c9c]">{label}</p>
      <div
        className={`flex items-end gap-2 ${compact ? "h-36" : "h-48"}`}
        role="img"
        aria-label={`Gráfico de ${label} por mes`}
      >
        {data.map((d) => {
          const value = d[valueKey];
          const pct = Math.max(4, (value / max) * 100);
          return (
            <div
              key={`${d.mes}-${valueKey}`}
              className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1"
            >
              <span className="text-[10px] font-medium text-[#f2f2f2]">{formatUsd(value)}</span>
              <div
                className="w-full max-w-[48px] rounded-t transition-all"
                style={{
                  height: `${pct}%`,
                  background: color,
                  minHeight: value > 0 ? "8px" : "2px",
                  opacity: value > 0 ? 1 : 0.2,
                }}
                title={`${d.mes}: ${formatUsd(value)} (${d.count} ventas)`}
              />
              <span className="w-full truncate text-center text-[10px] uppercase text-[#9c9c9c]">
                {d.mes.slice(0, 3)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SalesMonthlyCharts({ data, compact }: Props) {
  if (data.length === 0) {
    return (
      <div className="fuzz-card p-6 text-center text-sm text-[#9c9c9c]">
        No hay ventas cargadas.{" "}
        <Link href="/admin/ventas" className="text-[#e50914] hover:underline">
          Cargar ventas
        </Link>
      </div>
    );
  }

  const totalVentas = data.reduce((s, d) => s + d.ventasUsd, 0);
  const totalComision = data.reduce((s, d) => s + d.comisionFuzz, 0);

  return (
    <section className="fuzz-card space-y-6 p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="fuzz-title text-lg">Ventas por mes</h2>
          <p className="mt-1 text-sm text-[#9c9c9c]">
            Total {formatUsd(totalVentas)} · Comisión FUZZ {formatUsd(totalComision)}
          </p>
        </div>
        {!compact && (
          <Link href="/admin/ventas" className="text-sm text-[#e50914] hover:underline">
            Ver detalle →
          </Link>
        )}
      </div>

      <BarChart data={data} valueKey="ventasUsd" color="#e50914" label="Precio venta (USD)" compact={compact} />
      <BarChart
        data={data}
        valueKey="comisionFuzz"
        color="#f2f2f2"
        label="Comisión FUZZ (USD)"
        compact={compact}
      />

      <div className="overflow-x-auto rounded-lg border border-[#1c1c1c]">
        <table className="fuzz-table w-full text-sm">
          <thead>
            <tr>
              <th>Mes</th>
              <th>Ventas</th>
              <th>Operaciones</th>
              <th>Com. FUZZ</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.mes}>
                <td className="font-medium text-white">{d.mes}</td>
                <td>{formatUsd(d.ventasUsd)}</td>
                <td className="text-[#9c9c9c]">{d.count}</td>
                <td>{formatUsd(d.comisionFuzz)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
