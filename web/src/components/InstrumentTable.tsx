"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type InstrumentRow = {
  id: string;
  categoria: string;
  subcategoria: string | null;
  titulo: string;
  valorUsd: number | null;
  valorArg: number | null;
  contacto: string | null;
  marca: string | null;
  anio: string | null;
  origen: string | null;
  ig: string | null;
  clientName?: string | null;
  visibleInCatalog?: boolean;
};

type Props = {
  items: InstrumentRow[];
  showContact?: boolean;
  showClient?: boolean;
  showCatalogStatus?: boolean;
  admin?: boolean;
  /** Vista pública para clientes: sin precios ni datos internos */
  catalog?: boolean;
};

export function InstrumentTable({
  items,
  showContact,
  showClient,
  showCatalogStatus,
  admin,
  catalog,
}: Props) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [visibility, setVisibility] = useState<"" | "published" | "draft">("");

  const categories = useMemo(
    () => [...new Set(items.map((i) => i.categoria))].sort(),
    [items],
  );

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return items.filter((i) => {
      if (cat && i.categoria !== cat) return false;
      if (visibility === "published" && i.visibleInCatalog === false) return false;
      if (visibility === "draft" && i.visibleInCatalog !== false) return false;
      if (!term) return true;
      return (
        i.titulo.toLowerCase().includes(term) ||
        (i.marca?.toLowerCase().includes(term) ?? false) ||
        (i.subcategoria?.toLowerCase().includes(term) ?? false) ||
        (i.contacto?.toLowerCase().includes(term) ?? false)
      );
    });
  }, [items, q, cat, visibility]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          className="fuzz-input flex-1"
          placeholder="Buscar por título, marca..."
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
        {showCatalogStatus && (
          <select
            className="fuzz-input sm:max-w-xs"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as "" | "published" | "draft")}
          >
            <option value="">Todos (stock)</option>
            <option value="published">Visible en catálogo</option>
            <option value="draft">Borrador (oculto)</option>
          </select>
        )}
      </div>

      <p className="text-sm text-[#9c9c9c]">
        {filtered.length} de {items.length} instrumentos
      </p>

      <div className="overflow-x-auto rounded-lg border border-[#1c1c1c]">
        <table className="fuzz-table w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr>
              <th>Categoría</th>
              <th>Sub</th>
              <th>Título</th>
              <th>Marca</th>
              {catalog && <th>Año</th>}
              {catalog && <th>Origen</th>}
              {!catalog && <th>USD</th>}
              {showContact && <th>Contacto</th>}
              {showClient && <th>Cliente</th>}
              {showCatalogStatus && <th>Catálogo</th>}
              <th>IG</th>
              {admin && <th></th>}
            </tr>
          </thead>
          <tbody>
            {filtered.map((i) => (
              <tr key={i.id}>
                <td>{i.categoria}</td>
                <td className="text-[#9c9c9c]">{i.subcategoria ?? "—"}</td>
                <td className="font-medium text-white">
                  <span>{i.titulo}</span>
                  {showCatalogStatus && i.visibleInCatalog === false && (
                    <span className="ml-2 rounded bg-[#333] px-1.5 py-0.5 text-[10px] font-semibold uppercase text-[#9c9c9c]">
                      Borrador
                    </span>
                  )}
                </td>
                <td>{i.marca ?? "—"}</td>
                {catalog && <td>{i.anio ?? "—"}</td>}
                {catalog && <td>{i.origen ?? "—"}</td>}
                {!catalog && (
                  <td>{i.valorUsd != null ? `$${i.valorUsd.toLocaleString()}` : "—"}</td>
                )}
                {showContact && <td>{i.contacto ?? "—"}</td>}
                {showClient && <td>{i.clientName ?? "—"}</td>}
                {showCatalogStatus && (
                  <td>
                    {i.visibleInCatalog === false ? (
                      <span className="text-[#9c9c9c]">Oculto</span>
                    ) : (
                      <span className="text-[#25d366]">Visible</span>
                    )}
                  </td>
                )}
                <td>
                  {i.ig ? (
                    <a href={i.ig} target="_blank" rel="noreferrer" className="text-[#e50914]">
                      Ver
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                {admin && (
                  <td>
                    <Link href={`/admin/inventario/${i.id}`} className="text-[#e50914]">
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
