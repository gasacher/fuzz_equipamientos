"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  initial?: {
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
};

export function SaleForm({ initial }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const body = {
      historias: String(fd.get("historias") || "") || null,
      dia: String(fd.get("dia") || "") || null,
      titulo: String(fd.get("titulo")),
      precioVentaUsd: fd.get("precioVentaUsd") ? Number(fd.get("precioVentaUsd")) : null,
      porcentajeComision: fd.get("porcentajeComision") ? Number(fd.get("porcentajeComision")) : null,
      totalComisionFuzz: fd.get("totalComisionFuzz") ? Number(fd.get("totalComisionFuzz")) : null,
      mes: String(fd.get("mes") || "") || null,
      comKar: fd.get("comKar") ? Number(fd.get("comKar")) : null,
      comLean: fd.get("comLean") ? Number(fd.get("comLean")) : null,
      comFuzz: fd.get("comFuzz") ? Number(fd.get("comFuzz")) : null,
      anio: fd.get("anio") ? Number(fd.get("anio")) : null,
    };

    const url = initial ? `/api/sales/${initial.id}` : "/api/sales";
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
    router.push(initial ? `/admin/ventas/${initial.id}` : "/admin/ventas");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="fuzz-card mx-auto max-w-2xl space-y-4 p-6">
      <h2 className="fuzz-title text-xl">{initial ? "Editar venta" : "Nueva venta"}</h2>
      {error && <p className="text-sm text-[#e50914]">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1 sm:col-span-2">
          <span className="text-xs text-[#9c9c9c]">Título *</span>
          <input name="titulo" required defaultValue={initial?.titulo} className="fuzz-input" />
        </label>
        <label className="block space-y-1">
          <span className="text-xs text-[#9c9c9c]">Mes</span>
          <input name="mes" placeholder="ENERO, FEBRERO…" defaultValue={initial?.mes ?? ""} className="fuzz-input" />
        </label>
        <label className="block space-y-1">
          <span className="text-xs text-[#9c9c9c]">Año</span>
          <input name="anio" type="number" defaultValue={initial?.anio ?? new Date().getFullYear()} className="fuzz-input" />
        </label>
        <label className="block space-y-1">
          <span className="text-xs text-[#9c9c9c]">Día / ref.</span>
          <input name="dia" defaultValue={initial?.dia ?? ""} className="fuzz-input" />
        </label>
        <label className="block space-y-1">
          <span className="text-xs text-[#9c9c9c]">Historias</span>
          <input name="historias" defaultValue={initial?.historias ?? ""} className="fuzz-input" />
        </label>
        <label className="block space-y-1">
          <span className="text-xs text-[#9c9c9c]">Precio venta USD</span>
          <input name="precioVentaUsd" type="number" step="0.01" defaultValue={initial?.precioVentaUsd ?? ""} className="fuzz-input" />
        </label>
        <label className="block space-y-1">
          <span className="text-xs text-[#9c9c9c]">% comisión (0.1 = 10%)</span>
          <input name="porcentajeComision" type="number" step="0.01" defaultValue={initial?.porcentajeComision ?? ""} className="fuzz-input" />
        </label>
        <label className="block space-y-1">
          <span className="text-xs text-[#9c9c9c]">Total comisión FUZZ</span>
          <input name="totalComisionFuzz" type="number" step="0.01" defaultValue={initial?.totalComisionFuzz ?? ""} className="fuzz-input" />
        </label>
        <label className="block space-y-1">
          <span className="text-xs text-[#9c9c9c]">Com Kar</span>
          <input name="comKar" type="number" step="0.01" defaultValue={initial?.comKar ?? ""} className="fuzz-input" />
        </label>
        <label className="block space-y-1">
          <span className="text-xs text-[#9c9c9c]">Com Lean</span>
          <input name="comLean" type="number" step="0.01" defaultValue={initial?.comLean ?? ""} className="fuzz-input" />
        </label>
        <label className="block space-y-1">
          <span className="text-xs text-[#9c9c9c]">Com Fuzz</span>
          <input name="comFuzz" type="number" step="0.01" defaultValue={initial?.comFuzz ?? ""} className="fuzz-input" />
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
