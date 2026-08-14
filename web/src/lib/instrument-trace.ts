import type { PrismaClient } from "@/generated/prisma/client";
import { getStatusLabel, type InstrumentStatus } from "@/lib/instrument-status";
import {
  formatPublishedNetworksDetail,
  publishedNetworksEqual,
  type PublishedNetworksSource,
} from "@/lib/published-networks";

type TraceInput = {
  status: string;
  location?: string | null;
  buyer?: string | null;
  receiptName?: string | null;
  note?: string | null;
  titulo?: string;
  ig?: string | null;
  fb?: boolean;
  ml?: boolean;
};

const statusTitles: Record<string, string> = {
  ingresado: "Estado: ingresado",
  pendiente_foto: "Estado: pendiente de foto",
  foteado: "Estado: foteado",
  publicado: "Estado: publicado",
  en_showroom: "Estado: en showroom",
  con_cliente: "Estado: con el cliente",
  vendido: "Estado: vendido",
  entregado: "Estado: entregado",
};

export async function recordInstrumentEvent(
  prisma: PrismaClient,
  instrumentId: string,
  data: { type: string; title: string; detail?: string | null },
) {
  return prisma.instrumentEvent.create({
    data: {
      instrumentId,
      type: data.type,
      title: data.title,
      detail: data.detail ?? null,
    },
  });
}

export async function recordInitialTrace(
  prisma: PrismaClient,
  instrumentId: string,
  input: TraceInput,
) {
  const note = input.note?.trim();
  const location = input.location?.trim() || null;
  const titulo = input.titulo ?? "Producto";

  await recordInstrumentEvent(prisma, instrumentId, {
    type: "ingreso",
    title: "Ingreso al sistema",
    detail: note || `Producto ingresado: ${titulo}`,
  });

  await recordInstrumentEvent(prisma, instrumentId, {
    type: "estado",
    title: statusTitles[input.status] ?? `Estado: ${getStatusLabel(input.status)}`,
    detail: note || "Estado inicial al ingreso.",
  });

  if (location) {
    await recordInstrumentEvent(prisma, instrumentId, {
      type: "ubicacion",
      title: "Ubicación inicial",
      detail: location,
    });
  }

  if (input.status === "vendido" && input.buyer?.trim()) {
    const receipt = input.receiptName?.trim();
    await recordInstrumentEvent(prisma, instrumentId, {
      type: "venta",
      title: "Vendido",
      detail: `Comprador: ${input.buyer.trim()}${receipt ? `. Recibo: ${receipt}` : ""}`,
    });
  }

  if (input.status === "publicado") {
    await recordInstrumentEvent(prisma, instrumentId, {
      type: "publicacion",
      title: "Publicado en redes",
      detail: formatPublishedNetworksDetail({
        ig: input.ig,
        fb: input.fb,
        ml: input.ml,
      }),
    });
  }
}

export async function recordTraceChanges(
  prisma: PrismaClient,
  instrumentId: string,
  before: {
    status: string;
    location: string | null;
    buyer: string | null;
    receiptName: string | null;
    ig: string | null;
    fb: boolean;
    ml: boolean;
  },
  after: TraceInput,
) {
  const note = after.note?.trim();
  const location = after.location?.trim() || null;
  const afterPublished: PublishedNetworksSource = {
    ig: after.ig ?? null,
    fb: after.fb ?? false,
    ml: after.ml ?? false,
  };
  const beforePublished: PublishedNetworksSource = {
    ig: before.ig,
    fb: before.fb,
    ml: before.ml,
  };

  if (after.status !== before.status) {
    await recordInstrumentEvent(prisma, instrumentId, {
      type: "estado",
      title: statusTitles[after.status] ?? `Estado: ${getStatusLabel(after.status)}`,
      detail: note || "Cambio de estado registrado.",
    });
  }

  if (location !== (before.location?.trim() || null)) {
    await recordInstrumentEvent(prisma, instrumentId, {
      type: "ubicacion",
      title: "Ubicación actualizada",
      detail: location ?? "Sin ubicación",
    });
  }

  if (
    after.status === "publicado" &&
    (after.status !== before.status || !publishedNetworksEqual(beforePublished, afterPublished))
  ) {
    await recordInstrumentEvent(prisma, instrumentId, {
      type: "publicacion",
      title: "Publicado en redes",
      detail: formatPublishedNetworksDetail(afterPublished),
    });
  }

  if (
    after.status === "vendido" &&
    after.buyer?.trim() &&
    (after.buyer !== before.buyer || after.receiptName !== before.receiptName)
  ) {
    const receipt = after.receiptName?.trim();
    await recordInstrumentEvent(prisma, instrumentId, {
      type: "venta",
      title: "Vendido",
      detail: `Comprador: ${after.buyer.trim()}${receipt ? `. Recibo: ${receipt}` : ""}`,
    });
  }
}

export function mapInstrumentEvents(
  events: { type: string; title: string; detail: string | null; createdAt: Date }[],
) {
  return events.map((e) => ({
    at: e.createdAt.toISOString(),
    type: e.type,
    title: e.title,
    detail: e.detail ?? "",
  }));
}
