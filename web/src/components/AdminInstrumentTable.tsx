"use client";

import Link from "next/link";
import { InstrumentTable, type InstrumentRow } from "./InstrumentTable";

type Props = { items: InstrumentRow[] };

export function AdminInstrumentTable({ items }: Props) {
  return (
    <div className="space-y-4">
      <InstrumentTable items={items} showContact showClient />
      <div className="overflow-x-auto rounded-lg border border-[#1c1c1c] md:hidden">
        <p className="p-3 text-xs text-[#9c9c9c]">En desktop podés editar desde la tabla extendida.</p>
      </div>
      <ul className="grid gap-2 sm:grid-cols-2 lg:hidden">
        {items.slice(0, 20).map((i) => (
          <li key={i.id} className="fuzz-card p-3 text-sm">
            <p className="font-medium text-white">{i.titulo}</p>
            <p className="text-[#9c9c9c]">
              {i.categoria} · {i.clientName ?? "Sin cliente"}
            </p>
            <Link href={`/admin/inventario/${i.id}`} className="mt-2 inline-block text-[#e50914]">
              Editar
            </Link>
          </li>
        ))}
      </ul>
      <div className="hidden lg:block">
        <table className="fuzz-table w-full text-sm">
          <thead>
            <tr>
              <th>Acciones</th>
              <th>Título</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id}>
                <td>
                  <Link href={`/admin/inventario/${i.id}`} className="text-[#e50914]">
                    Editar
                  </Link>
                </td>
                <td>{i.titulo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
