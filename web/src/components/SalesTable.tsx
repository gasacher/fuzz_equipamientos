"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type SaleRow = {
  id: string;
  historias: string | null;
  dia: string | null;
  titulo: string;
  precioVentaUsd: number | null;
  porcentajeComision: number | null;
  totalComisionFuzz: number | null;
  mes: string | null;
  comKar: number | null;
  comLean: number | null;
  comFuzz: number | null;
  anio: number | null;
};

function fmtUsd(n: number | null) {
  if (n == null) return "—";
  return `$${n.toLocaleString("es-AR", { maximumFractionDigits: 2 })}`;
}

function fmtPct(n: number | null) {
  if (n == null) return "—";
  return `${(n * 100).toFixed(0)}%`;
}

type Props = {
  items: SaleRow[];
  admin?: boolean;
};

export function SalesTable({ items, admin }: Props) {
  const [q, setQ] = useState("");
  const [mes, setMes] = useState("");
  const [anio, setAnio] = useState("");

  const meses = useMemo(
    () => [...new Set(items.map((i) => i.mes).filter(Boolean) as string[])].sort(),
    [items],
  );
  const anios = useMemo(
    () => [...new Set(items.map((i) => i.anio).filter(Boolean) as number[])].sort((a, b) => b - a),
    [items],
  );

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return items.filter((i) => {
      if (mes && i.mes !== mes) return false;
      if (anio && String(i.anio) !== anio) return false;
      if (!term) return true;
      return (
        i.titulo.toLowerCase().includes(term) ||
        (i.dia?.toLowerCase().includes(term) ?? false) ||
        (i.mes?.toLowerCase().includes(term) ?? false)
      );
    });
  }, [items, q, mes, anio]);

  const totals = useMemo(() => {
    let ventas = 0;
    let comision = 0;
    for (const i of filtered) {
      ventas += i.precioVentaUsd ?? 0;
      comision += i.totalComisionFuzz ?? 0;
    }
    return { ventas, comision };
  }, [filtered]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <input
          className="fuzz-input lg:col-span-2"
          placeholder="Buscar por título..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className="fuzz-input" value={mes} onChange={(e) => setMes(e.target.value)}>
          <option value="">Todos los meses</option>
          {meses.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <select className="fuzz-input" value={anio} onChange={(e) => setAnio(e.target.value)}>
          <option value="">Todos los años</option>
          {anios.map((y) => (
            <option key={y} value={String(y)}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-[#9c9c9c]">
        <span>
          {filtered.length} de {items.length} ventas
        </span>
        <span>Total ventas: {fmtUsd(totals.ventas)}</span>
        <span>Comisión FUZZ: {fmtUsd(totals.comision)}</span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#1c1c1c]">
        <table className="fuzz-table w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr>
              <th>Mes</th>
              <th>Día</th>
              <th>Título</th>
              <th>Precio USD</th>
              <th>% Com.</th>
              <th>Com. FUZZ</th>
              <th>Com Kar</th>
              <th>Com Lean</th>
              {admin && <th></th>}
            </tr>
          </thead>
          <tbody>
            {filtered.map((i) => (
              <tr key={i.id}>
                <td>{i.mes ?? "—"}</td>
                <td className="text-[#9c9c9c]">{i.dia ?? i.historias ?? "—"}</td>
                <td className="font-medium text-white">{i.titulo}</td>
                <td>{fmtUsd(i.precioVentaUsd)}</td>
                <td>{fmtPct(i.porcentajeComision)}</td>
                <td>{fmtUsd(i.totalComisionFuzz)}</td>
                <td>{fmtUsd(i.comKar)}</td>
                <td>{fmtUsd(i.comLean)}</td>
                {admin && (
                  <td>
                    <Link href={`/admin/ventas/${i.id}`} className="text-[#e50914]">
                      Editar
                    </Link>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
