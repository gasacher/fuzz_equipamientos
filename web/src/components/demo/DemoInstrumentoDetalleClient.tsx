"use client";

import Link from "next/link";
import { DemoInstrumentoDetalle } from "@/components/demo/DemoInstrumentoDetalle";
import { getDemoTraceability, getDemoTraceabilityDisplay } from "@/lib/demo-features";
import { useDemoInstrument } from "@/hooks/useDemoInstrument";
import { panelDemoPath } from "@/lib/panel-demo-path";

export function DemoInstrumentoDetalleClient({ id }: { id: string }) {
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

  return (
    <DemoInstrumentoDetalle
      item={item}
      baseTrace={trace}
      fallbackStatus={display.status}
      fallbackLocation={display.location}
      defaultHistory={[
        {
          at: new Date().toISOString(),
          type: "nota",
          title: "Sin movimientos registrados",
          detail: "Editá el producto para cambiar estado o ubicación.",
        },
      ]}
    />
  );
}
