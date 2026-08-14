"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { InstrumentForm } from "@/components/InstrumentForm";
import { InstrumentTraceabilityEditor } from "@/components/demo/InstrumentTraceabilityEditor";
import type { InstrumentTaxonomy } from "@/lib/taxonomy";
import type { DemoTraceability } from "@/lib/demo-features";
import { mergeDemoTrace } from "@/lib/demo-trace-storage";
import { enrichTracePublished } from "@/lib/published-networks";
import { panelDemoPath } from "@/lib/panel-demo-path";

type Instrument = {
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
  visibleInCatalog?: boolean;
};

type Props = {
  item: Instrument;
  taxonomy: InstrumentTaxonomy;
  baseTrace: DemoTraceability | null;
  fallbackStatus: string;
  fallbackLocation: string;
};

export function DemoInstrumentoEditar({
  item,
  taxonomy,
  baseTrace,
  fallbackStatus,
  fallbackLocation,
}: Props) {
  const verHref = panelDemoPath(`/inventario/${item.id}`);
  const [trace, setTrace] = useState<DemoTraceability>(() => {
    const merged = mergeDemoTrace(item.id, baseTrace, {
      status: fallbackStatus,
      location: fallbackLocation,
    });
    const published = enrichTracePublished(merged.status, merged.published, { ig: item.ig });
    return published ? { ...merged, published } : merged;
  });

  useEffect(() => {
    const merged = mergeDemoTrace(item.id, baseTrace, {
      status: fallbackStatus,
      location: fallbackLocation,
    });
    const published = enrichTracePublished(merged.status, merged.published, { ig: item.ig });
    setTrace(published ? { ...merged, published } : merged);
  }, [item.id, item.ig, baseTrace, fallbackStatus, fallbackLocation]);

  return (
    <div className="space-y-6">
      <Link href={verHref} className="text-sm text-[#9c9c9c] hover:text-white">
        ← Ver producto
      </Link>

      <header>
        <h1 className="fuzz-title text-2xl text-white">Editar: {item.titulo}</h1>
        <p className="mt-1 text-sm text-[#9c9c9c]">
          Estado, ubicación y datos del producto en un solo lugar.
        </p>
      </header>

      <InstrumentTraceabilityEditor
        instrumentId={item.id}
        trace={trace}
        onSaved={setTrace}
      />

      <InstrumentForm
        taxonomy={taxonomy}
        demoMode
        listHref={verHref}
        initial={{
          id: item.id,
          categoria: item.categoria,
          subcategoria: item.subcategoria,
          titulo: item.titulo,
          valorUsd: item.valorUsd,
          valorArg: item.valorArg,
          contacto: item.contacto,
          marca: item.marca,
          anio: item.anio,
          origen: item.origen,
          ig: item.ig,
          imageUrl: null,
          descripcion: null,
          visibleInCatalog: item.visibleInCatalog ?? true,
        }}
      />
    </div>
  );
}
