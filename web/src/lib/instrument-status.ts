export const INSTRUMENT_STATUSES = [
  "ingresado",
  "pendiente_foto",
  "foteado",
  "publicado",
  "en_showroom",
  "con_cliente",
  "vendido",
  "entregado",
] as const;

export type InstrumentStatus = (typeof INSTRUMENT_STATUSES)[number];

export const STATUS_LABELS: Record<InstrumentStatus, string> = {
  ingresado: "Ingresado",
  pendiente_foto: "Pendiente de foto",
  foteado: "Foteado",
  publicado: "Publicado",
  en_showroom: "En showroom",
  con_cliente: "Con el cliente",
  vendido: "Vendido",
  entregado: "Entregado",
};

export function getStatusLabel(status: string) {
  return STATUS_LABELS[status as InstrumentStatus] ?? status;
}

export function defaultStatusForCatalog(visibleInCatalog: boolean): InstrumentStatus {
  return visibleInCatalog ? "publicado" : "pendiente_foto";
}
