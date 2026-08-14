import type { DemoHistoryEvent, DemoTraceability } from "@/lib/demo-features";
import {
  formatPublishedNetworksDetail,
  publishedNetworksEqual,
  publishedNetworksFromFields,
  publishedNetworksToDb,
  type PublishedNetworksSource,
} from "@/lib/published-networks";

const KEY = "fuzz-demo-traces";

type Store = Record<string, DemoTraceability>;

function readStore(): Store {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}") as Store;
  } catch {
    return {};
  }
}

function writeStore(store: Store) {
  localStorage.setItem(KEY, JSON.stringify(store));
}

export function getDemoTraceOverride(instrumentId: string): DemoTraceability | null {
  return readStore()[instrumentId] ?? null;
}

export function saveDemoTraceOverride(instrumentId: string, trace: DemoTraceability) {
  const store = readStore();
  store[instrumentId] = trace;
  writeStore(store);
}

export function mergeDemoTrace(
  instrumentId: string,
  base: DemoTraceability | null,
  fallback: { status: string; location: string },
): DemoTraceability {
  const override = getDemoTraceOverride(instrumentId);
  if (override) return override;
  if (base) return base;
  return {
    status: fallback.status,
    location: fallback.location,
    tags: [],
    buyer: null,
    receipt: null,
    history: [],
  };
}

const statusEventTitle: Record<string, string> = {
  ingresado: "Estado: ingresado",
  pendiente_foto: "Estado: pendiente de foto",
  foteado: "Estado: foteado",
  publicado: "Estado: publicado",
  en_showroom: "Estado: en showroom",
  con_cliente: "Estado: con el cliente",
  vendido: "Estado: vendido",
  entregado: "Estado: entregado",
};

export function appendTraceChange(
  current: DemoTraceability,
  patch: {
    status: string;
    location: string;
    note?: string;
    buyer?: string | null;
    receiptName?: string | null;
    receiptUrl?: string | null;
    publishedInstagram?: boolean;
    publishedMarketplace?: boolean;
    publishedMercadoLibre?: boolean;
    instagramUrl?: string;
  },
): DemoTraceability {
  const events: DemoHistoryEvent[] = [...current.history];
  const at = new Date().toISOString();
  const published = publishedNetworksToDb(
    patch.status,
    publishedNetworksFromFields({
      publishedInstagram: patch.publishedInstagram ?? false,
      publishedMarketplace: patch.publishedMarketplace ?? false,
      publishedMercadoLibre: patch.publishedMercadoLibre ?? false,
      instagramUrl: patch.instagramUrl ?? "",
    }),
  );
  const beforePublished: PublishedNetworksSource = current.published ?? {
    ig: null,
    fb: false,
    ml: false,
  };

  if (patch.status !== current.status) {
    events.unshift({
      at,
      type: "estado",
      title: statusEventTitle[patch.status] ?? `Estado: ${patch.status}`,
      detail: patch.note?.trim() || "Cambio de estado registrado.",
    });
  }

  if (patch.location.trim() !== current.location) {
    events.unshift({
      at,
      type: "ubicacion",
      title: "Ubicación actualizada",
      detail: patch.location.trim(),
    });
  }

  if (
    patch.status === "publicado" &&
    (patch.status !== current.status || !publishedNetworksEqual(beforePublished, published))
  ) {
    events.unshift({
      at,
      type: "publicacion",
      title: "Publicado en redes",
      detail: formatPublishedNetworksDetail(published),
    });
  }

  if (patch.status === "vendido" && patch.buyer?.trim()) {
    const receipt = patch.receiptName?.trim();
    events.unshift({
      at,
      type: "venta",
      title: "Vendido",
      detail: `Comprador: ${patch.buyer.trim()}${receipt ? `. Recibo: ${receipt}` : ""}`,
    });
  }

  return {
    ...current,
    status: patch.status,
    location: patch.location.trim(),
    published: patch.status === "publicado" ? published : null,
    buyer: patch.status === "vendido" ? patch.buyer?.trim() || null : current.buyer,
    receipt:
      patch.status === "vendido" && (patch.receiptName?.trim() || patch.receiptUrl)
        ? {
            name: patch.receiptName?.trim() || current.receipt?.name || "recibo",
            date: new Date().toISOString().slice(0, 10),
            url: patch.receiptUrl ?? current.receipt?.url,
          }
        : patch.status === "vendido"
          ? current.receipt
          : null,
    history: events,
  };
}
