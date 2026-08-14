import type { Prisma } from "@/generated/prisma/client";

/** Instrumentos vinculados por clientId o campo contacto (Excel). */
export function clientInstrumentsWhere(
  client: Pick<{ id: string; name: string }, "id" | "name">,
): Prisma.InstrumentWhereInput {
  return {
    OR: [{ clientId: client.id }, { contacto: client.name }],
  };
}

export const clientInstrumentListSelect = {
  id: true,
  titulo: true,
  categoria: true,
  subcategoria: true,
  contacto: true,
  valorUsd: true,
  status: true,
  location: true,
  ig: true,
  fb: true,
  ml: true,
  visibleInCatalog: true,
  imageUrl: true,
} as const;
