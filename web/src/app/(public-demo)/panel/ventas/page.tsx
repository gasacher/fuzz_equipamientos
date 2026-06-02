"use client";

import Link from "next/link";
import { SalesTable } from "@/components/SalesTable";
import adminDemo from "@/data/admin-demo.json";
import { panelDemoPath } from "@/lib/panel-demo-path";

export default function DemoVentasPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href={panelDemoPath()} className="text-sm text-[#9c9c9c] hover:text-white">
            ← Panel
          </Link>
          <h1 className="fuzz-title mt-2 text-3xl">Ventas</h1>
          <p className="text-sm text-[#9c9c9c]">
            Listado completo con filtros y totales (hoja VENTAS del Excel).
          </p>
        </div>
        <span className="btn-fuzz pointer-events-none opacity-80">+ Nueva venta</span>
      </div>
      <SalesTable items={adminDemo.sales} admin pathPrefix={panelDemoPath()} />
    </div>
  );
}
