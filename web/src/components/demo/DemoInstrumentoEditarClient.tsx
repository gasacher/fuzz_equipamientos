"use client";

import Link from "next/link";
import { DemoInstrumentoEditar } from "@/components/demo/DemoInstrumentoEditar";
import {
  getDemoTaxonomy,
  getDemoTaxonomyForInstrument,
} from "@/lib/demo-admin";
import { getDemoTraceability, getDemoTraceabilityDisplay } from "@/lib/demo-features";
import { useDemoInstrument } from "@/hooks/useDemoInstrument";
import { panelDemoPath } from "@/lib/panel-demo-path";

export function DemoInstrumentoEditarClient({ id }: { id: string }) {
  const item = useDemoInstrument(id);

  if (!item) {
    return (
      <div className="fuzz-card space-y-4 p-8 text-center">
        <p className="text-[#9c9c9c]">Producto no encontrado.</p>
        <Link href={panelDemoPath("/inventario")} className="text-[#e50914] hover:underline">
          Volver al inventario
        </Link>
      </div>
    );
  }

  const trace = getDemoTraceability(id);
  const display = getDemoTraceabilityDisplay(id, item);
  const taxonomy = getDemoTaxonomyForInstrument(item.categoria, item.subcategoria ?? null);

  return (
    <DemoInstrumentoEditar
      item={item}
      taxonomy={taxonomy.categories.length ? taxonomy : getDemoTaxonomy()}
      baseTrace={trace}
      fallbackStatus={display.status}
      fallbackLocation={display.location}
    />
  );
}
