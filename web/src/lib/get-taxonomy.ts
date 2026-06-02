import { buildTaxonomy } from "@/lib/taxonomy";
import { prisma } from "@/lib/prisma";

export async function getInstrumentTaxonomy() {
  const items = await prisma.instrument.findMany({
    select: { categoria: true, subcategoria: true },
  });
  return buildTaxonomy(items);
}
