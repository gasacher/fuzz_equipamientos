"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { InstrumentTimeline } from "@/components/demo/InstrumentTimeline";
import { InstrumentTraceabilityCard } from "@/components/demo/InstrumentTraceabilityCard";
import { StatusBadge } from "@/components/demo/StatusBadge";
import type { DemoTraceability } from "@/lib/demo-features";
import { mergeDemoTrace } from "@/lib/demo-trace-storage";
import { enrichTracePublished } from "@/lib/published-networks";
import { panelDemoPath } from "@/lib/panel-demo-path";

type Instrument = {
  id: string;
  titulo: string;
  categoria: string;
  subcategoria: string | null;
  contacto: string | null;
  valorUsd: number | null;
  visibleInCatalog?: boolean;
  ig?: string | null;
};

type Props = {
  item: Instrument;
  baseTrace: DemoTraceability | null;
  fallbackStatus: string;
  fallbackLocation: string;
  defaultHistory: DemoTraceability["history"];
};

function withPublished(trace: DemoTraceability, item: Instrument): DemoTraceability {
  const published = enrichTracePublished(trace.status, trace.published, { ig: item.ig });
  return published ? { ...trace, published } : trace;
}

export function DemoInstrumentoDetalle({
  item,
  baseTrace,
  fallbackStatus,
  fallbackLocation,
  defaultHistory,
}: Props) {
  const [trace, setTrace] = useState<DemoTraceability>(() =>
    withPublished(
      mergeDemoTrace(item.id, baseTrace, {
        status: fallbackStatus,
        location: fallbackLocation,
      }),
      item,
    ),
  );

  useEffect(() => {
    setTrace(
      withPublished(
        mergeDemoTrace(item.id, baseTrace, {
          status: fallbackStatus,
          location: fallbackLocation,
        }),
        item,
      ),
    );
  }, [item.id, item.ig, baseTrace, fallbackStatus, fallbackLocation]);

  const history =
    trace.history.length > 0 ? trace.history : defaultHistory;

  return (
    <div className="space-y-6">
      <Link href={panelDemoPath("/inventario")} className="text-sm text-[#9c9c9c] hover:text-white">
        ← Inventario
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="fuzz-title text-2xl text-white md:text-3xl">{item.titulo}</h1>
          <p className="mt-1 text-sm text-[#9c9c9c]">
            {item.categoria}
            {item.subcategoria ? ` · ${item.subcategoria}` : ""}
            {item.contacto ? ` · ${item.contacto}` : ""}
            {item.valorUsd != null ? ` · USD ${item.valorUsd.toLocaleString()}` : ""}
          </p>
        </div>
        <StatusBadge status={trace.status} />
      </header>

      <InstrumentTraceabilityCard trace={{ ...trace, history }} />

      <InstrumentTimeline events={history} buyer={trace.buyer} receipt={trace.receipt} />

      <div className="flex flex-wrap gap-3 border-t border-[#1c1c1c] pt-6">
        <Link href={panelDemoPath(`/inventario/${item.id}/editar`)} className="btn-fuzz">
          Editar
        </Link>
      </div>
    </div>
  );
}
