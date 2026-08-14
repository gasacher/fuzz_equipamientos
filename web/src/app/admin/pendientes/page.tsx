import { PendingQueueTable } from "@/components/demo/PendingQueueTable";
import { computePendingQueue } from "@/lib/internal-control";
import { prisma } from "@/lib/prisma";

export default async function AdminPendientesPage() {
  const instruments = await prisma.instrument.findMany({
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
  });

  const queue = computePendingQueue(instruments);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="fuzz-title text-2xl text-white md:text-3xl">Control interno</h1>
        <p className="mt-1 text-sm text-[#9c9c9c]">
          Borradores al ingreso, tags automáticos y alertas según demoras (foto, precio,
          publicación).
        </p>
      </header>

      <PendingQueueTable
        items={queue}
        instrumentPath={(id) => `/admin/inventario/${id}`}
      />
    </div>
  );
}
