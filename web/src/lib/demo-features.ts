import adminDemo from "@/data/admin-demo.json";
import demoFeatures from "@/data/demo-features.json";
import type { PublishedNetworksSource } from "@/lib/published-networks";

export type DemoHistoryEvent = {
  at: string;
  type: string;
  title: string;
  detail: string;
};
export type DemoClient = (typeof demoFeatures.clients)[number];
export type DemoContract = DemoClient["contracts"][number];
export type DemoTraceability = {
  status: string;
  location: string;
  tags: string[];
  daysPending?: number;
  buyer?: string | null;
  receipt?: { name: string; date: string; url?: string } | null;
  published?: PublishedNetworksSource | null;
  history: DemoHistoryEvent[];
};
export type DemoPendingItem = (typeof demoFeatures.pendingQueue)[number] & {
  titulo: string;
  categoria: string;
  contacto: string | null;
};

const traceability = demoFeatures.traceability as Record<string, DemoTraceability>;

export function getStatusLabel(status: string) {
  return demoFeatures.statusLabels[status as keyof typeof demoFeatures.statusLabels] ?? status;
}

export function getDemoTraceability(instrumentId: string): DemoTraceability | null {
  return traceability[instrumentId] ?? null;
}

export function getDemoClients() {
  return demoFeatures.clients.map((client) => {
    const instruments = adminDemo.instruments.filter(
      (i) => i.contacto === client.contactMatch,
    );
    return {
      id: client.id,
      clientNumber: client.clientNumber,
      name: client.name,
      phone: client.phone,
      email: client.email,
      notes: client.notes,
      contracts: client.contracts,
      instruments,
      instrumentCount: instruments.length,
    };
  });
}

export function getDemoClient(id: string) {
  return getDemoClients().find((c) => c.id === id);
}

export function demoClientStaticParams() {
  return demoFeatures.clients.map((c) => ({ id: c.id }));
}

export function getDemoPendingQueue(): DemoPendingItem[] {
  return demoFeatures.pendingQueue.map((item) => {
    const inst = adminDemo.instruments.find((i) => i.id === item.instrumentId);
    return {
      ...item,
      titulo: inst?.titulo ?? "—",
      categoria: inst?.categoria ?? "—",
      contacto: inst?.contacto ?? null,
    };
  });
}

export function countPendingAlerts() {
  const queue = getDemoPendingQueue();
  return {
    total: queue.length,
    critical: queue.filter((q) => q.alert === "critical").length,
    warning: queue.filter((q) => q.alert === "warning").length,
  };
}

/** Estado y ubicación para listado (con valores por defecto si no hay historial demo). */
export function getDemoTraceabilityDisplay(
  instrumentId: string,
  instrument: { visibleInCatalog?: boolean },
) {
  const trace = getDemoTraceability(instrumentId);
  if (trace) {
    return { status: trace.status, location: trace.location };
  }
  return {
    status: instrument.visibleInCatalog !== false ? "publicado" : "pendiente_foto",
    location: "Sin registrar",
  };
}

export function formatDemoDate(iso: string) {
  return new Date(iso).toLocaleString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** GitHub Pages: solo páginas de ejemplo para la presentación (no las 383+). */
export function getGhPagesShowcaseInstrumentIds() {
  return Object.keys(traceability);
}

export function getGhPagesShowcaseSaleIds() {
  return adminDemo.sales.slice(0, 8).map((s) => s.id);
}
