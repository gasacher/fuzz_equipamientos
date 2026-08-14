import { DashboardPillars } from "@/components/DashboardPillars";
import { adminDemo } from "@/lib/demo-admin";
import { countPendingAlerts, getDemoClients } from "@/lib/demo-features";
import { panelDemoPath } from "@/lib/panel-demo-path";

export default function PanelDashboardPage() {
  const clients = getDemoClients();
  const alerts = countPendingAlerts();

  return (
    <div className="space-y-10">
      <header className="relative overflow-hidden rounded-2xl border border-[#1c1c1c] bg-gradient-to-br from-[#1a0a0a] via-[#111] to-black p-8 md:p-10">
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-[#e50914]/10 blur-3xl" />
        <p className="text-xs font-semibold uppercase tracking-widest text-[#e50914]">Panel FUZZ</p>
        <h1 className="fuzz-title mt-2 text-3xl text-white md:text-4xl">Dashboard</h1>
        <p className="mt-3 max-w-xl text-sm text-[#9c9c9c] md:text-base">
          Elegí una sección para gestionar clientes, inventario con trazabilidad, pendientes o
          ventas.
        </p>
      </header>

      <DashboardPillars
        pathPrefix="/panel"
        catalogHref={panelDemoPath("/catalogo")}
        stats={{
          clients: clients.length,
          instruments: adminDemo.instruments.length,
          pendingTotal: alerts.total,
          pendingCritical: alerts.critical,
          salesCount: adminDemo.sales.length,
          traceabilityReady: true,
        }}
      />
    </div>
  );
}

