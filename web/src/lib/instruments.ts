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
};

export function toInstrumentData(input: InstrumentInput): Prisma.InstrumentCreateInput {
  const { clientId, ...rest } = input;
  return {
    ...rest,
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
