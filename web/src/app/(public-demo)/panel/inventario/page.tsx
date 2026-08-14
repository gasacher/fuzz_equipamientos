"use client";

import Link from "next/link";
import { DemoInventarioTable } from "@/components/demo/DemoInventarioTable";
import adminDemo from "@/data/admin-demo.json";
import { panelDemoPath } from "@/lib/panel-demo-path";

const EJEMPLOS = [
  { id: "cmprld92y0001rw3dnei1pkvl", label: "Publicado en showroom" },
  { id: "cmprld9d400ckrw3de62kiudv", label: "Vendido + recibo" },
  { id: "cmprld9300002rw3dfxawr78j", label: "Pendiente de foto" },
];

export default function DemoInventarioPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="fuzz-title text-3xl">Inventario</h1>
          <p className="mt-2 max-w-xl text-sm text-[#9c9c9c]">
            Cada producto tiene <strong className="text-[#f2f2f2]">estado</strong>,{" "}
            <strong className="text-[#f2f2f2]">ubicación</strong> e{" "}
            <strong className="text-[#f2f2f2]">historial con fechas</strong>: foteado, publicado,
            showroom, con el cliente, vendido, comprador y recibo.
          </p>
        </div>
        <Link href={panelDemoPath("/inventario/nuevo")} className="btn-fuzz">
          + Ingresar producto
        </Link>
      </header>

      <div className="rounded-lg border border-[#1c1c1c] bg-[#111] px-4 py-3 text-sm text-[#9c9c9c]">
        <span className="text-white">Ejemplos con historial:</span>{" "}
        {EJEMPLOS.map((e, i) => (
          <span key={e.id}>
            {i > 0 && " · "}
            <Link
              href={panelDemoPath(`/inventario/${e.id}/editar`)}
              className="text-[#e50914] hover:underline"
            >
              {e.label}
            </Link>
          </span>
        ))}
      </div>

      <DemoInventarioTable items={adminDemo.instruments} />
    </div>
  );
}
