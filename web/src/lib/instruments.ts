import type { Prisma } from "@/generated/prisma/client";

export type InstrumentInput = {
  historias?: string | null;
  categoria: string;
  subcategoria?: string | null;
  titulo: string;
  valorUsd?: number | null;
  valorArg?: number | null;
  contacto?: string | null;
  fb?: boolean;
  ig?: string | null;
  ml?: boolean;
  marca?: string | null;
  anio?: string | null;
  origen?: string | null;
  imageUrl?: string | null;
  descripcion?: string | null;
  visibleInCatalog?: boolean;
  clientId?: string | null;
  status?: string;
  location?: string | null;
  buyer?: string | null;
  receiptName?: string | null;
  traceNote?: string | null;
};

export function toInstrumentData(input: InstrumentInput): Prisma.InstrumentCreateInput {
  const { clientId, traceNote: _note, ...rest } = input;
  return {
    ...rest,
    status: rest.status ?? "ingresado",
    location: rest.location?.trim() || null,
    buyer: rest.buyer?.trim() || null,
    receiptName: rest.receiptName?.trim() || null,
    fb: rest.fb ?? false,
    ml: rest.ml ?? false,
    visibleInCatalog: rest.visibleInCatalog ?? true,
    client: clientId ? { connect: { id: clientId } } : undefined,
  };
}

export function normalizeContacto(name: string | null | undefined) {
  if (!name) return null;
  const trimmed = name.trim();
  if (!trimmed || trimmed === "?" || trimmed === "-") return null;
  return trimmed;
}
