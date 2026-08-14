import { PendingQueueTable } from "@/components/demo/PendingQueueTable";
import { getDemoPendingQueue } from "@/lib/demo-features";
import { panelDemoPath } from "@/lib/panel-demo-path";

export default function DemoPendientesPage() {
  const queue = getDemoPendingQueue();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="fuzz-title text-2xl text-white md:text-3xl">Control interno</h1>
        <p className="mt-1 text-sm text-[#9c9c9c]">
          Cola de pendientes con tags y alertas según demoras: borradores, fotos, precios y
          publicación.
        </p>
      </header>

      <PendingQueueTable
        items={queue}
        instrumentPath={(id) => panelDemoPath(`/inventario/${id}`)}
      />
    </div>
  );
}
