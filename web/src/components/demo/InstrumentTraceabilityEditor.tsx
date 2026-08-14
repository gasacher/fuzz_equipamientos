"use client";

import { useState } from "react";
import {
  InstrumentTraceabilityFields,
  traceabilityFieldsFromPublished,
  type TraceabilityFieldValues,
} from "@/components/demo/InstrumentTraceabilityFields";
import type { DemoTraceability } from "@/lib/demo-features";
import { readFileAsDataUrl } from "@/lib/receipt-file";
import {
  publishedNetworksFromFields,
  validatePublishedNetworks,
} from "@/lib/published-networks";
import { appendTraceChange, saveDemoTraceOverride } from "@/lib/demo-trace-storage";

type Props = {
  instrumentId: string;
  trace: DemoTraceability;
  onSaved: (trace: DemoTraceability) => void;
};

export function InstrumentTraceabilityEditor({ instrumentId, trace, onSaved }: Props) {
  const [fields, setFields] = useState<TraceabilityFieldValues>(() => ({
    status: trace.status,
    location: trace.location === "Sin registrar" ? "" : trace.location,
    note: "",
    buyer: trace.buyer ?? "",
    receiptName: trace.receipt?.name ?? "",
    receiptFile: null,
    receiptUrl: trace.receipt?.url ?? null,
    ...traceabilityFieldsFromPublished(trace.published ?? { ig: null, fb: false, ml: false }),
  }));
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const publishedError = validatePublishedNetworks(
      fields.status,
      publishedNetworksFromFields(fields),
    );
    if (publishedError) {
      setError(publishedError);
      return;
    }
    setError("");
    setLoading(true);

    let receiptUrl = fields.receiptUrl;
    if (fields.receiptFile) {
      receiptUrl = await readFileAsDataUrl(fields.receiptFile);
    }

    const next = appendTraceChange(trace, {
      status: fields.status,
      location: fields.location,
      note: fields.note,
      buyer: fields.status === "vendido" ? fields.buyer : null,
      receiptName: fields.status === "vendido" ? fields.receiptName : null,
      receiptUrl: fields.status === "vendido" ? receiptUrl : null,
      publishedInstagram: fields.publishedInstagram,
      publishedMarketplace: fields.publishedMarketplace,
      publishedMercadoLibre: fields.publishedMercadoLibre,
      instagramUrl: fields.instagramUrl,
    });
    saveDemoTraceOverride(instrumentId, next);
    onSaved(next);
    setFields((f) => ({
      ...f,
      note: "",
      receiptFile: null,
      receiptName: next.receipt?.name ?? "",
      receiptUrl: next.receipt?.url ?? null,
    }));
    setSaved(true);
    setLoading(false);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <form onSubmit={onSubmit} className="fuzz-card space-y-4 p-6">
      <InstrumentTraceabilityFields
        {...fields}
        heading="Cambiar estado y ubicación"
        onChange={(patch) => setFields((f) => ({ ...f, ...patch }))}
      />
      {error && <p className="text-sm text-[#e50914]">{error}</p>}
      <button type="submit" className="btn-fuzz" disabled={loading || !!fields.receiptError}>
        {saved ? "Guardado ✓" : loading ? "Guardando..." : "Guardar cambio"}
      </button>
    </form>
  );
}
