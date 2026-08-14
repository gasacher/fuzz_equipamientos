"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type ClientListRow = {
  id: string;
  name: string;
  clientNumber: string | null;
  email: string | null;
  phone: string | null;
  instrumentCount: number;
};

type Props = {
  clients: ClientListRow[];
};

export function ClientsList({ clients }: Props) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return clients;
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        (c.clientNumber?.toLowerCase().includes(term) ?? false) ||
        (c.email?.toLowerCase().includes(term) ?? false) ||
        (c.phone?.toLowerCase().includes(term) ?? false),
    );
  }, [clients, q]);

  return (
    <div className="space-y-4">
      <input
        className="fuzz-input"
        placeholder="Buscar por nombre, nº FUZZ, teléfono o email…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <p className="text-sm text-[#9c9c9c]">
        {filtered.length} de {clients.length} clientes · Tocá uno para ver contacto, contratos e
        instrumentos
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <Link
            key={c.id}
            href={`/admin/clientes/${c.id}`}
            className="group block rounded-xl border border-[#1c1c1c] bg-[#111] p-5 transition hover:border-[#e50914] hover:shadow-[0_0_32px_-12px_rgba(229,9,20,0.25)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-mono text-xs text-[#e50914]">{c.clientNumber ?? "Sin nº"}</p>
                <h2 className="fuzz-title mt-1 truncate text-lg text-white group-hover:text-[#e50914]">
                  {c.name}
                </h2>
                <p className="mt-2 truncate text-sm text-[#9c9c9c]">
                  {c.phone ?? "Sin teléfono"}
                  {c.email ? ` · ${c.email}` : ""}
                </p>
              </div>
              <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl border border-[#333] bg-[#0f0f0f] group-hover:border-[#e50914]">
                <span className="text-xl font-bold tabular-nums text-white">{c.instrumentCount}</span>
                <span className="text-[10px] uppercase text-[#9c9c9c]">items</span>
              </div>
            </div>
            <p className="mt-4 text-sm font-medium text-[#f2f2f2] group-hover:text-[#e50914]">
              Ver cliente →
            </p>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="fuzz-card p-8 text-center text-sm text-[#9c9c9c]">
          No hay clientes que coincidan con la búsqueda.
        </div>
      )}
    </div>
  );
}
