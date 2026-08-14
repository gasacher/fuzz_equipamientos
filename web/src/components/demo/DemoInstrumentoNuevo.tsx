"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CategoryFields } from "@/components/CategoryFields";
import { buildInitialTrace, defaultTraceabilityFields, InstrumentTraceabilityFields } from "@/components/demo/InstrumentTraceabilityFields";
import { readFileAsDataUrl } from "@/lib/receipt-file";
import {
  publishedNetworksFromFields,
  publishedNetworksToDb,
  validatePublishedNetworks,
} from "@/lib/published-networks";
import type { InstrumentTaxonomy } from "@/lib/taxonomy";
import {
  newDemoInstrumentId,
  saveDemoNewInstrument,
} from "@/lib/demo-inventory-storage";
import { saveDemoTraceOverride } from "@/lib/demo-trace-storage";
import { panelDemoPath } from "@/lib/panel-demo-path";

type Props = {
  taxonomy: InstrumentTaxonomy;
};

export function DemoInstrumentoNuevo({ taxonomy }: Props) {
  const router = useRouter();
  const listHref = panelDemoPath("/inventario");
  const [traceFields, setTraceFields] = useState(defaultTraceabilityFields);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const categoria = String(fd.get("categoria") || "").trim();
    const titulo = String(fd.get("titulo") || "").trim();

    if (!categoria) {
      setError("Elegí o creá una categoría");
      setLoading(false);
      return;
    }
    if (!titulo) {
      setError("El título es obligatorio");
      setLoading(false);
      return;
    }
    if (!traceFields.location.trim()) {
      setError("Indicá la ubicación del producto");
      setLoading(false);
      return;
    }
    if (traceFields.receiptError) {
      setError(traceFields.receiptError);
      setLoading(false);
      return;
    }
    const publishedError = validatePublishedNetworks(
      traceFields.status,
      publishedNetworksFromFields(traceFields),
    );
    if (publishedError) {
      setError(publishedError);
      setLoading(false);
      return;
    }

    let receiptUrl: string | null = null;
    if (traceFields.status === "vendido" && traceFields.receiptFile) {
      receiptUrl = await readFileAsDataUrl(traceFields.receiptFile);
    }

    const id = newDemoInstrumentId();
    const published = publishedNetworksToDb(
      traceFields.status,
      publishedNetworksFromFields(traceFields),
    );
    const item = {
      id,
      categoria,
      subcategoria: String(fd.get("subcategoria") || "").trim() || null,
      titulo,
      valorUsd: fd.get("valorUsd") ? Number(fd.get("valorUsd")) : null,
      valorArg: fd.get("valorArg") ? Number(fd.get("valorArg")) : null,
      contacto: String(fd.get("contacto") || "") || null,
      marca: String(fd.get("marca") || "") || null,
      anio: String(fd.get("anio") || "") || null,
      origen: String(fd.get("origen") || "") || null,
      ig: published.ig ?? null,
      visibleInCatalog: fd.get("visibleInCatalog") === "on",
    };

    saveDemoNewInstrument(item);
    saveDemoTraceOverride(id, buildInitialTrace(titulo, traceFields, receiptUrl));

    setLoading(false);
    router.push(panelDemoPath(`/inventario/${id}`));
  }

  return (
    <div className="space-y-4">
      <Link href={listHref} className="text-sm text-[#9c9c9c] hover:text-white">
        ← Inventario
      </Link>

      <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-6">
        <div className="fuzz-card space-y-4 p-6">
          <InstrumentTraceabilityFields
            {...traceFields}
            heading="Estado al ingreso"
            onChange={(patch) => setTraceFields((f) => ({ ...f, ...patch }))}
          />
        </div>

        <div className="fuzz-card space-y-4 p-6">
          <h2 className="fuzz-title text-xl">Datos del producto</h2>
          {error && <p className="text-sm text-[#e50914]">{error}</p>}

          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#1c1c1c] bg-[#0f0f0f] p-4">
            <input
              type="checkbox"
              name="visibleInCatalog"
              defaultChecked
              className="mt-1 h-4 w-4 accent-[#e50914]"
            />
            <span>
              <span className="block font-medium text-white">Visible en catálogo web</span>
              <span className="block text-xs text-[#9c9c9c]">Desactivado = borrador interno.</span>
            </span>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <CategoryFields taxonomy={taxonomy} />
            <label className="block space-y-1 sm:col-span-2">
              <span className="text-xs text-[#9c9c9c]">Título *</span>
              <input name="titulo" required className="fuzz-input" />
            </label>
            <label className="block space-y-1">
              <span className="text-xs text-[#9c9c9c]">Valor USD</span>
              <input name="valorUsd" type="number" step="0.01" className="fuzz-input" />
            </label>
            <label className="block space-y-1">
              <span className="text-xs text-[#9c9c9c]">Valor ARG</span>
              <input name="valorArg" type="number" step="0.01" className="fuzz-input" />
            </label>
            <label className="block space-y-1">
              <span className="text-xs text-[#9c9c9c]">Marca</span>
              <input name="marca" className="fuzz-input" />
            </label>
            <label className="block space-y-1">
              <span className="text-xs text-[#9c9c9c]">Contacto</span>
              <input name="contacto" className="fuzz-input" />
            </label>
          </div>
        </div>

        <button type="submit" className="btn-fuzz" disabled={loading}>
          {loading ? "Guardando..." : "Ingresar producto"}
        </button>
      </form>
    </div>
  );
}
