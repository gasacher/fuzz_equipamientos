"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PublishedNetworksBadges } from "@/components/demo/PublishedNetworksBadges";
import { StatusBadge } from "@/components/demo/StatusBadge";
import { TagBadge } from "@/components/demo/TagBadge";
import type { InstrumentRow } from "@/components/InstrumentTable";
import adminDemo from "@/data/admin-demo.json";
import { getDemoTraceabilityDisplay, getStatusLabel } from "@/lib/demo-features";
import { computeInstrumentTags } from "@/lib/internal-control";
import { INSTRUMENT_STATUSES } from "@/lib/instrument-status";
import { getDemoNewInstruments } from "@/lib/demo-inventory-storage";
import { enrichTracePublished } from "@/lib/published-networks";
import { getDemoTraceOverride } from "@/lib/demo-trace-storage";
import { panelDemoPath } from "@/lib/panel-demo-path";

type Props = {
  items: InstrumentRow[];
  mergeSessionNew?: boolean;
};

export function DemoInventarioTable({ items: staticItems, mergeSessionNew = true }: Props) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [newItems, setNewItems] = useState<InstrumentRow[]>([]);

  useEffect(() => {
    if (mergeSessionNew) setNewItems(getDemoNewInstruments());
  }, [mergeSessionNew]);

  const items = useMemo(() => [...newItems, ...staticItems], [newItems, staticItems]);

  const categories = useMemo(
    () => [...new Set(items.map((i) => i.categoria))].sort(),
    [items],
  );

  const rows = useMemo(
    () =>
      items.map((item) => {
        const override = typeof window !== "undefined" ? getDemoTraceOverride(item.id) : null;
        const base = getDemoTraceabilityDisplay(item.id, item);
        const trace = override ?? base;
        const status = trace.status;
        const published = enrichTracePublished(status, override?.published, { ig: item.ig }) ?? {
          ig: null,
          fb: false,
          ml: false,
        };
        const tags = computeInstrumentTags({
          id: item.id,
          titulo: item.titulo,
          categoria: item.categoria,
          contacto: item.contacto,
          status,
          visibleInCatalog: item.visibleInCatalog ?? true,
          imageUrl: item.imageUrl ?? null,
          valorUsd: item.valorUsd,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        return { item, trace: { status, location: trace.location }, published, tags };
      }),
    [items],
  );

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return rows.filter(({ item, trace, tags }) => {
      if (cat && item.categoria !== cat) return false;
      if (statusFilter && trace.status !== statusFilter) return false;
      if (!term) return true;
      return (
        item.titulo.toLowerCase().includes(term) ||
        (item.contacto?.toLowerCase().includes(term) ?? false) ||
        trace.location.toLowerCase().includes(term) ||
        tags.some((tag) => tag.toLowerCase().includes(term))
      );
    });
  }, [rows, q, cat, statusFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          className="fuzz-input flex-1"
          placeholder="Buscar por título, contacto, ubicación..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className="fuzz-input sm:max-w-xs" value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          className="fuzz-input sm:max-w-xs"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Todos los estados</option>
          {INSTRUMENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {getStatusLabel(s)}
            </option>
          ))}
        </select>
      </div>

      <p className="text-sm text-[#9c9c9c]">
        {filtered.length} de {items.length}
        {newItems.length > 0 && (
          <span className="text-[#e50914]"> · {newItems.length} ingresados en esta sesión</span>
        )}
      </p>

      <div className="overflow-x-auto rounded-lg border border-[#1c1c1c]">
        <table className="fuzz-table w-full min-w-[980px] text-left text-sm">
          <thead>
            <tr>
              <th>Título</th>
              <th>Estado</th>
              <th>Etiquetas</th>
              <th>Redes</th>
              <th>Ubicación</th>
              <th>Contacto</th>
              <th>USD</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(({ item, trace, published, tags }) => (
              <tr key={item.id}>
                <td className="font-medium text-white">
                  {item.titulo}
                  <span className="mt-0.5 block text-xs text-[#9c9c9c]">
                    {item.categoria}
                    {item.subcategoria ? ` · ${item.subcategoria}` : ""}
                  </span>
                </td>
                <td>
                  <StatusBadge status={trace.status} />
                </td>
                <td>
                  <div className="flex max-w-[220px] flex-wrap gap-1">
                    {tags.length > 0 ? (
                      tags.map((tag) => <TagBadge key={tag} tag={tag} />)
                    ) : (
                      <span className="text-[#9c9c9c]">—</span>
                    )}
                  </div>
                </td>
                <td>
                  <PublishedNetworksBadges source={published} compact />
                </td>
                <td className="max-w-[180px] text-[#9c9c9c]">{trace.location}</td>
                <td>{item.contacto ?? "—"}</td>
                <td>{item.valorUsd != null ? `$${item.valorUsd.toLocaleString()}` : "—"}</td>
                <td>
                  <div className="flex gap-3">
                    <Link
                      href={panelDemoPath(`/inventario/${item.id}/editar`)}
                      className="text-[#e50914] hover:underline"
                    >
                      Editar
                    </Link>
                    <Link
                      href={panelDemoPath(`/inventario/${item.id}`)}
                      className="text-[#9c9c9c] hover:text-white"
                    >
                      Ver
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
