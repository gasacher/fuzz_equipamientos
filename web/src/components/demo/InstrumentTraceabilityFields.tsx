import type { DemoHistoryEvent, DemoTraceability } from "@/lib/demo-features";
import { INSTRUMENT_STATUSES, getStatusLabel } from "@/lib/instrument-status";
import { ReceiptFileField } from "@/components/ReceiptFileField";
import {
  PUBLISHED_NETWORK_LABELS,
  formatPublishedNetworksDetail,
  publishedNetworksFromFields,
  publishedNetworksToDb,
  type PublishedNetworksSource,
} from "@/lib/published-networks";

export const DEMO_STATUS_KEYS = [...INSTRUMENT_STATUSES];

export type TraceabilityFieldValues = {
  status: string;
  location: string;
  note: string;
  buyer: string;
  receiptName: string;
  receiptFile: File | null;
  receiptUrl: string | null;
  receiptError?: string;
  publishedInstagram: boolean;
  publishedMarketplace: boolean;
  publishedMercadoLibre: boolean;
  instagramUrl: string;
};

export const defaultTraceabilityFields = (): TraceabilityFieldValues => ({
  status: "ingresado",
  location: "",
  note: "",
  buyer: "",
  receiptName: "",
  receiptFile: null,
  receiptUrl: null,
  publishedInstagram: false,
  publishedMarketplace: false,
  publishedMercadoLibre: false,
  instagramUrl: "",
});

export function traceabilityFieldsFromPublished(source: PublishedNetworksSource): Pick<
  TraceabilityFieldValues,
  "publishedInstagram" | "publishedMarketplace" | "publishedMercadoLibre" | "instagramUrl"
> {
  const instagramUrl = source.ig?.trim() ?? "";
  return {
    publishedInstagram: !!instagramUrl,
    publishedMarketplace: source.fb ?? false,
    publishedMercadoLibre: source.ml ?? false,
    instagramUrl,
  };
}

type FieldsProps = TraceabilityFieldValues & {
  onChange: (patch: Partial<TraceabilityFieldValues>) => void;
  heading?: string;
};

export function InstrumentTraceabilityFields({
  status,
  location,
  note,
  buyer,
  receiptName,
  receiptFile,
  receiptUrl,
  receiptError,
  publishedInstagram,
  publishedMarketplace,
  publishedMercadoLibre,
  instagramUrl,
  onChange,
  heading = "Estado y ubicación",
}: FieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="fuzz-title text-lg">{heading}</h2>
        <p className="mt-1 text-sm text-[#9c9c9c]">
          Al ingresar o editar, el estado y la ubicación quedan en el historial con fecha.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1">
          <span className="text-xs text-[#9c9c9c]">Estado *</span>
          <select
            className="fuzz-input"
            value={status}
            onChange={(e) => onChange({ status: e.target.value })}
            required
          >
            {DEMO_STATUS_KEYS.map((key) => (
              <option key={key} value={key}>
                {getStatusLabel(key)}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-1">
          <span className="text-xs text-[#9c9c9c]">Ubicación *</span>
          <input
            className="fuzz-input"
            value={location}
            onChange={(e) => onChange({ location: e.target.value })}
            placeholder="Showroom, depósito, con cliente…"
            required
          />
        </label>
      </div>

      {status === "publicado" && (
        <div className="space-y-3 rounded-lg border border-[#1c1c1c] bg-[#0f0f0f] p-4">
          <div>
            <p className="text-sm font-medium text-white">Redes de publicación</p>
            <p className="mt-1 text-xs text-[#9c9c9c]">
              Marcá dónde está publicado el producto.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-[#f2f2f2]">
              <input
                type="checkbox"
                className="h-4 w-4 accent-[#e50914]"
                checked={publishedInstagram}
                onChange={(e) =>
                  onChange({
                    publishedInstagram: e.target.checked,
                    instagramUrl: e.target.checked ? instagramUrl : "",
                  })
                }
              />
              {PUBLISHED_NETWORK_LABELS.instagram}
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-[#f2f2f2]">
              <input
                type="checkbox"
                className="h-4 w-4 accent-[#e50914]"
                checked={publishedMarketplace}
                onChange={(e) => onChange({ publishedMarketplace: e.target.checked })}
              />
              {PUBLISHED_NETWORK_LABELS.marketplace}
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-[#f2f2f2]">
              <input
                type="checkbox"
                className="h-4 w-4 accent-[#e50914]"
                checked={publishedMercadoLibre}
                onChange={(e) => onChange({ publishedMercadoLibre: e.target.checked })}
              />
              {PUBLISHED_NETWORK_LABELS.mercadoLibre}
            </label>
          </div>
          {publishedInstagram && (
            <label className="block space-y-1">
              <span className="text-xs text-[#9c9c9c]">Link de la publicación en Instagram *</span>
              <input
                className="fuzz-input"
                type="url"
                value={instagramUrl}
                onChange={(e) => onChange({ instagramUrl: e.target.value })}
                placeholder="https://www.instagram.com/p/…"
                required
              />
            </label>
          )}
        </div>
      )}

      {status === "vendido" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-xs text-[#9c9c9c]">Comprador</span>
            <input
              className="fuzz-input"
              value={buyer}
              onChange={(e) => onChange({ buyer: e.target.value })}
            />
          </label>
          <ReceiptFileField
            fileName={receiptFile ? receiptName : ""}
            existingUrl={receiptUrl}
            onChange={(patch) => onChange(patch)}
          />
        </div>
      )}

      {receiptError && <p className="text-sm text-[#e50914]">{receiptError}</p>}

      <label className="block space-y-1">
        <span className="text-xs text-[#9c9c9c]">Nota (opcional)</span>
        <input
          className="fuzz-input"
          value={note}
          onChange={(e) => onChange({ note: e.target.value })}
          placeholder="Ej. ingreso por consignación"
        />
      </label>
    </div>
  );
}

export function buildInitialTrace(
  titulo: string,
  fields: TraceabilityFieldValues,
  receiptUrl?: string | null,
): DemoTraceability {
  const at = new Date().toISOString();
  const history: DemoHistoryEvent[] = [
    {
      at,
      type: "ingreso",
      title: "Ingreso al sistema",
      detail: fields.note.trim() || `Producto ingresado: ${titulo}`,
    },
    {
      at,
      type: "estado",
      title: `Estado: ${getStatusLabel(fields.status)}`,
      detail: fields.note.trim() || "Estado inicial al ingreso.",
    },
  ];

  if (fields.location.trim()) {
    history.unshift({
      at,
      type: "ubicacion",
      title: "Ubicación inicial",
      detail: fields.location.trim(),
    });
  }

  const receiptName = fields.receiptName.trim();
  const url = receiptUrl ?? fields.receiptUrl;
  const published = publishedNetworksToDb(
    fields.status,
    publishedNetworksFromFields(fields),
  );

  if (fields.status === "publicado") {
    history.splice(1, 0, {
      at,
      type: "publicacion",
      title: "Publicado en redes",
      detail: formatPublishedNetworksDetail(published),
    });
  }

  return {
    status: fields.status,
    location: fields.location.trim() || "Sin registrar",
    tags: [],
    published: fields.status === "publicado" ? published : null,
    buyer: fields.status === "vendido" ? fields.buyer.trim() || null : null,
    receipt:
      fields.status === "vendido" && (receiptName || url)
        ? {
            name: receiptName || "recibo",
            date: at.slice(0, 10),
            ...(url ? { url } : {}),
          }
        : null,
    history,
  };
}
