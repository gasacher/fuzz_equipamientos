"use client";

import Link from "next/link";
import { InstrumentTable } from "@/components/InstrumentTable";
import adminDemo from "@/data/admin-demo.json";
import { panelDemoPath } from "@/lib/panel-demo-path";

export default function DemoInventarioPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href={panelDemoPath()} className="text-sm text-[#9c9c9c] hover:text-white">
            ← Panel
          </Link>
          <h1 className="fuzz-title mt-2 text-3xl">Stock / Inventario</h1>
          <p className="text-sm text-[#9c9c9c]">
            Los cambios se publican al instante en el{" "}
            <Link href={panelDemoPath("/catalogo")} className="text-[#e50914] hover:underline">
              catálogo web
            </Link>{" "}
            que ven los clientes.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={panelDemoPath("/catalogo")} className="btn-fuzz-outline">
            Ver catálogo web
          </Link>
          <span className="btn-fuzz pointer-events-none opacity-80">+ Nuevo</span>
        </div>
      </div>
      <InstrumentTable
        items={adminDemo.instruments}
        showContact
        showCatalogStatus
        admin
        pathPrefix={panelDemoPath()}
      />
    </div>
  );
}
