import { DashboardPillars } from "@/components/DashboardPillars";
import { countPendingAlerts, computePendingQueue } from "@/lib/internal-control";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [clientCount, instrumentCount, salesCount, appointmentsPending, instruments] =
    await Promise.all([
    prisma.client.count(),
    prisma.instrument.count(),
    prisma.sale.count(),
    prisma.showroomAppointment.count({ where: { status: "pending" } }),
    prisma.instrument.findMany({
      select: {
        id: true,
        titulo: true,
        categoria: true,
        contacto: true,
        status: true,
        visibleInCatalog: true,
        imageUrl: true,
        valorUsd: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
  ]);

  const queue = computePendingQueue(instruments);
  const alerts = countPendingAlerts(queue);

  return (
    <div className="space-y-10">
      <header className="relative overflow-hidden rounded-2xl border border-[#1c1c1c] bg-gradient-to-br from-[#1a0a0a] via-[#111] to-black p-8 md:p-10">
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-[#e50914]/10 blur-3xl" />
        <p className="text-xs font-semibold uppercase tracking-widest text-[#e50914]">Admin FUZZ</p>
        <h1 className="fuzz-title mt-2 text-3xl text-white md:text-4xl">Dashboard</h1>
        <p className="mt-3 max-w-xl text-sm text-[#9c9c9c] md:text-base">
          Elegí una sección para gestionar clientes, inventario, pendientes, ventas o citas al
          showroom.
        </p>
      </header>

      <DashboardPillars
        pathPrefix="/admin"
        catalogHref="/admin/catalogo"
        showroomHref="/showroom"
        stats={{
          clients: clientCount,
          instruments: instrumentCount,
          pendingTotal: alerts.total,
          pendingCritical: alerts.critical,
          salesCount,
          appointmentsPending,
          traceabilityReady: true,
        }}
      />
    </div>
  );
}
