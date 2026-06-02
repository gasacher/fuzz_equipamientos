"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CategoryFields } from "@/components/CategoryFields";
import type { InstrumentTaxonomy } from "@/lib/taxonomy";

type Props = {
  taxonomy: InstrumentTaxonomy;
  initial?: {
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
    imageUrl: string | null;
    descripcion: string | null;
    visibleInCatalog: boolean;
  };
};

export function InstrumentForm({ taxonomy, initial }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const categoria = String(fd.get("categoria") || "").trim();
    const subcategoria = String(fd.get("subcategoria") || "").trim() || null;
    if (!categoria) {
      setError("Elegí o creá una categoría");
      setLoading(false);
      return;
    }

    const body = {
      categoria,
      subcategoria,
      titulo: String(fd.get("titulo")),
      valorUsd: fd.get("valorUsd") ? Number(fd.get("valorUsd")) : null,
      valorArg: fd.get("valorArg") ? Number(fd.get("valorArg")) : null,
      contacto: String(fd.get("contacto") || "") || null,
      marca: String(fd.get("marca") || "") || null,
      anio: String(fd.get("anio") || "") || null,
      origen: String(fd.get("origen") || "") || null,
      ig: String(fd.get("ig") || "") || null,
      imageUrl: String(fd.get("imageUrl") || "") || null,
      descripcion: String(fd.get("descripcion") || "") || null,
      visibleInCatalog: fd.get("visibleInCatalog") === "on",
    };

    const url = initial ? `/api/instruments/${initial.id}` : "/api/instruments";
    const method = initial ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "No se pudo guardar");
      return;
    }
    router.push(initial ? `/admin/inventario/${initial.id}` : "/admin/inventario");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="fuzz-card mx-auto max-w-2xl space-y-4 p-6">
      <h2 className="fuzz-title text-xl">
        {initial ? "Editar instrumento" : "Nuevo instrumento"}
      </h2>
      <p className="text-xs text-[#9c9c9c]">
        Al guardar, el catálogo web se actualiza automáticamente (mismo stock).
      </p>
      {error && <p className="text-sm text-[#e50914]">{error}</p>}

      <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#1c1c1c] bg-[#0f0f0f] p-4">
        <input
          type="checkbox"
          name="visibleInCatalog"
          defaultChecked={initial?.visibleInCatalog ?? true}
          className="mt-1 h-4 w-4 accent-[#e50914]"
        />
        <span>
          <span className="block font-medium text-white">Visible en catálogo web</span>
          <span className="block text-xs text-[#9c9c9c]">
            Desactivado = queda en inventario pero no lo ven los clientes (borrador).
          </span>
        </span>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <CategoryFields
          taxonomy={taxonomy}
          initialCategoria={initial?.categoria}
          initialSubcategoria={initial?.subcategoria}
        />
        <label className="block space-y-1 sm:col-span-2">
          <span className="text-xs text-[#9c9c9c]">Título *</span>
          <input name="titulo" required defaultValue={initial?.titulo} className="fuzz-input" />
        </label>
        <label className="block space-y-1">
          <span className="text-xs text-[#9c9c9c]">Valor USD</span>
          <input name="valorUsd" type="number" step="0.01" defaultValue={initial?.valorUsd ?? ""} className="fuzz-input" />
        </label>
        <label className="block space-y-1">
          <span className="text-xs text-[#9c9c9c]">Valor ARG</span>
          <input name="valorArg" type="number" step="0.01" defaultValue={initial?.valorArg ?? ""} className="fuzz-input" />
        </label>
        <label className="block space-y-1">
          <span className="text-xs text-[#9c9c9c]">Marca</span>
          <input name="marca" defaultValue={initial?.marca ?? ""} className="fuzz-input" />
        </label>
        <label className="block space-y-1">
          <span className="text-xs text-[#9c9c9c]">Año</span>
          <input name="anio" defaultValue={initial?.anio ?? ""} className="fuzz-input" />
        </label>
        <label className="block space-y-1">
          <span className="text-xs text-[#9c9c9c]">Contacto (interno)</span>
          <input name="contacto" defaultValue={initial?.contacto ?? ""} className="fuzz-input" />
        </label>
        <label className="block space-y-1 sm:col-span-2">
          <span className="text-xs text-[#9c9c9c]">URL foto (catálogo web)</span>
          <input
            name="imageUrl"
            type="url"
            placeholder="https://… o vacío = foto por categoría"
            defaultValue={initial?.imageUrl ?? ""}
            className="fuzz-input"
          />
        </label>
        <label className="block space-y-1 sm:col-span-2">
          <span className="text-xs text-[#9c9c9c]">Descripción (catálogo web)</span>
          <textarea
            name="descripcion"
            rows={3}
            defaultValue={initial?.descripcion ?? ""}
            className="fuzz-input"
          />
        </label>
        <label className="block space-y-1 sm:col-span-2">
          <span className="text-xs text-[#9c9c9c]">Link Instagram</span>
          <input name="ig" defaultValue={initial?.ig ?? ""} className="fuzz-input" />
        </label>
        <label className="block space-y-1 sm:col-span-2">
          <span className="text-xs text-[#9c9c9c]">Origen</span>
          <input name="origen" defaultValue={initial?.origen ?? ""} className="fuzz-input" />
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-fuzz" disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </button>
        <button type="button" className="btn-fuzz-outline" onClick={() => router.back()}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
