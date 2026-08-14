import type { Instrument } from "@/generated/prisma/client";

export type AlertLevel = "critical" | "warning" | "info";

export type PendingItem = {
  instrumentId: string;
  titulo: string;
  categoria: string;
  contacto: string | null;
  status: string;
  tags: string[];
  daysSince: number;
  alert: AlertLevel;
  note: string;
};

type InstrumentForControl = Pick<
  Instrument,
  | "id"
  | "titulo"
  | "categoria"
  | "contacto"
  | "status"
  | "visibleInCatalog"
  | "imageUrl"
  | "valorUsd"
  | "createdAt"
  | "updatedAt"
>;

function daysSince(date: Date) {
  return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
}

export function computeInstrumentTags(item: InstrumentForControl): string[] {
  const tags: string[] = [];
  if (!item.visibleInCatalog) tags.push("borrador");
  if (!item.imageUrl || item.status === "pendiente_foto") tags.push("falta_foto");
  if (item.valorUsd == null) tags.push("sin_precio");
  if (item.status === "foteado") tags.push("pendiente_publicar");
  if (item.status === "en_showroom") tags.push("showroom");
  if (item.status === "con_cliente") tags.push("consignacion");
  return tags;
}

function alertLevel(days: number, tags: string[]): AlertLevel {
  if (days >= 30 || (days >= 14 && tags.includes("urgente"))) return "critical";
  if (days >= 7 || tags.includes("falta_foto") || tags.includes("sin_precio")) return "warning";
  return "info";
}

function pendingNote(item: InstrumentForControl, tags: string[]): string {
  if (tags.includes("borrador")) return "Borrador interno — no visible en catálogo";
  if (tags.includes("falta_foto")) return "Pendiente de foto";
  if (tags.includes("sin_precio")) return "Sin precio USD definido";
  if (tags.includes("pendiente_publicar")) return "Foteado, falta publicar en catálogo";
  if (tags.includes("revisar_precio")) return "Publicado sin movimiento reciente";
  if (item.status === "en_showroom") return "En showroom sin movimiento";
  return "Seguimiento interno";
}

export function computePendingQueue(items: InstrumentForControl[]): PendingItem[] {
  const queue: PendingItem[] = [];

  for (const item of items) {
    if (item.status === "vendido" || item.status === "entregado") continue;

    const tags = computeInstrumentTags(item);
    const days = daysSince(item.updatedAt ?? item.createdAt);

    const needsAttention =
      tags.length > 0 ||
      item.status === "pendiente_foto" ||
      item.status === "ingresado" ||
      item.status === "foteado" ||
      days >= 7;

    if (!needsAttention) continue;

    if (days >= 21 && item.status === "publicado" && !tags.includes("revisar_precio")) {
      tags.push("revisar_precio");
    }
    if (days >= 14 && tags.includes("falta_foto")) {
      tags.push("urgente");
    }

    queue.push({
      instrumentId: item.id,
      titulo: item.titulo,
      categoria: item.categoria,
      contacto: item.contacto,
      status: item.status,
      tags,
      daysSince: days,
      alert: alertLevel(days, tags),
      note: pendingNote(item, tags),
    });
  }

  return queue.sort((a, b) => {
    const order = { critical: 0, warning: 1, info: 2 };
    return order[a.alert] - order[b.alert] || b.daysSince - a.daysSince;
  });
}

export function countPendingAlerts(queue: PendingItem[]) {
  return {
    total: queue.length,
    critical: queue.filter((q) => q.alert === "critical").length,
    warning: queue.filter((q) => q.alert === "warning").length,
  };
}
