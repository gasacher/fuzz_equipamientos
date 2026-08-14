import Link from "next/link";
import { notFound } from "next/navigation";
import { InstrumentTimeline } from "@/components/demo/InstrumentTimeline";
import { InstrumentTraceabilityCard } from "@/components/demo/InstrumentTraceabilityCard";
import { StatusBadge } from "@/components/demo/StatusBadge";
import { mapInstrumentEvents } from "@/lib/instrument-trace";
import { receiptDownloadPath } from "@/lib/receipt-file";
import { computeInstrumentTags } from "@/lib/internal-control";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export default async function AdminInstrumentoDetallePage({ params }: Props) {
  const { id } = await params;
  const item = await prisma.instrument.findUnique({
    where: { id },
    include: { events: { orderBy: { createdAt: "desc" } } },
  });
  if (!item) notFound();

  const history = mapInstrumentEvents(item.events);
  const tags = computeInstrumentTags(item);
  const trace = {
    status: item.status,
    location: item.location ?? "Sin registrar",
    tags,
    published:
      item.status === "publicado"
        ? { ig: item.ig, fb: item.fb, ml: item.ml }
        : null,
    buyer: item.buyer,
    receipt: item.receiptName
      ? {
          name: item.receiptName,
          date: item.updatedAt.toISOString().slice(0, 10),
          ...(item.receiptPath ? { url: receiptDownloadPath(id) } : {}),
        }
      : null,
    history,
  };

  return (
    <div className="space-y-6">
      <Link href="/admin/inventario" className="text-sm text-[#9c9c9c] hover:text-white">
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
        <StatusBadge status={item.status} />
      </header>

      <InstrumentTraceabilityCard trace={trace} />
      <InstrumentTimeline
        events={history}
        buyer={item.buyer}
        receipt={trace.receipt}
      />

      <div className="border-t border-[#1c1c1c] pt-6">
        <Link href={`/admin/inventario/${item.id}/editar`} className="btn-fuzz">
          Editar
        </Link>
      </div>
    </div>
  );
}
