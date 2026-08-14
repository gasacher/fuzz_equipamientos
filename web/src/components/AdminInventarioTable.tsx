"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PublishedNetworksBadges } from "@/components/demo/PublishedNetworksBadges";
import { StatusBadge } from "@/components/demo/StatusBadge";
import { TagBadge } from "@/components/demo/TagBadge";
import { computeInstrumentTags } from "@/lib/internal-control";
import { INSTRUMENT_STATUSES, getStatusLabel } from "@/lib/instrument-status";

export type AdminInstrumentRow = {
  id: string;
  titulo: string;
  categoria: string;
  subcategoria: string | null;
  contacto: string | null;
  valorUsd: number | null;
  status: string;
  location: string | null;
  ig?: string | null;
  fb?: boolean;
  ml?: boolean;
  visibleInCatalog?: boolean;
  imageUrl?: string | null;
};

type Props = {
  items: AdminInstrumentRow[];
  showFilters?: boolean;
  pathPrefix?: string;
};

export function AdminInventarioTable({
  items,
  showFilters = true,
  pathPrefix = "/admin",
}: Props) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const categories = useMemo(
    () => [...new Set(items.map((i) => i.categoria))].sort(),
    [items],
  );

  const rows = useMemo(
    () =>
      items.map((item) => ({
        item,
        tags: computeInstrumentTags({
          id: item.id,
          titulo: item.titulo,
          categoria: item.categoria,
          contacto: item.contacto,
          status: item.status,
          visibleInCatalog: item.visibleInCatalog ?? true,
          imageUrl: item.imageUrl ?? null,
          valorUsd: item.valorUsd,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
        published: {
          ig: item.ig,
          fb: item.fb ?? false,
          ml: item.ml ?? false,
        },
      })),
    [items],
  );

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return rows.filter(({ item, tags }) => {
      if (cat && item.categoria !== cat) return false;
      if (statusFilter && item.status !== statusFilter) return false;
      if (!term) return true;
      return (
        item.titulo.toLowerCase().includes(term) ||
        (item.contacto?.toLowerCase().includes(term) ?? false) ||
        (item.location?.toLowerCase().includes(term) ?? false) ||
        tags.some((tag) => tag.toLowerCase().includes(term))
      );
    });
  }, [rows, q, cat, statusFilter]);

  return (
    <div className="space-y-4">
      {showFilters && (
        <>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              className="fuzz-input flex-1"
              placeholder="Buscar por título, contacto, ubicación, etiqueta..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <select
              className="fuzz-input sm:max-w-xs"
              value={cat}
              onChange={(e) => setCat(e.target.value)}
            >
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
            {filtered.length} de {items.length} productos
          </p>
        </>
      )}

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
            {filtered.map(({ item, tags, published }) => (
              <tr key={item.id}>
                <td className="font-medium text-white">
                  {item.titulo}
                  <span className="mt-0.5 block text-xs text-[#9c9c9c]">
                    {item.categoria}
                    {item.subcategoria ? ` · ${item.subcategoria}` : ""}
                  </span>
                </td>
                <td>
                  <StatusBadge status={item.status} />
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
                <td className="max-w-[180px] text-[#9c9c9c]">{item.location ?? "—"}</td>
                <td>{item.contacto ?? "—"}</td>
                <td>{item.valorUsd != null ? `$${item.valorUsd.toLocaleString()}` : "—"}</td>
                <td>
                  <div className="flex gap-3">
                    <Link
                      href={`${pathPrefix}/inventario/${item.id}/editar`}
                      className="text-[#e50914] hover:underline"
                    >
                      Editar
                    </Link>
                    <Link
                      href={`${pathPrefix}/inventario/${item.id}`}
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
        {filtered.length === 0 && (
          <p className="p-6 text-center text-sm text-[#9c9c9c]">Sin instrumentos en stock.</p>
        )}
      </div>
    </div>
  );
}
