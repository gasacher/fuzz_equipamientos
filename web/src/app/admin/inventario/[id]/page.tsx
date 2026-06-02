import { notFound } from "next/navigation";
import { InstrumentForm } from "@/components/InstrumentForm";
import { DeleteInstrumentButton } from "@/components/DeleteInstrumentButton";
import { getInstrumentTaxonomy } from "@/lib/get-taxonomy";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export default async function EditarInstrumentoPage({ params }: Props) {
  const { id } = await params;
  const [item, taxonomy] = await Promise.all([
    prisma.instrument.findUnique({ where: { id } }),
    getInstrumentTaxonomy(),
  ]);

  if (!item) notFound();

  return (
    <div className="space-y-4">
      <InstrumentForm
        taxonomy={taxonomy}
        initial={{
          id: item.id,
          categoria: item.categoria,
          subcategoria: item.subcategoria,
          titulo: item.titulo,
          valorUsd: item.valorUsd,
          valorArg: item.valorArg,
          contacto: item.contacto,
          marca: item.marca,
          anio: item.anio,
          origen: item.origen,
          ig: item.ig,
          imageUrl: item.imageUrl,
          descripcion: item.descripcion,
          visibleInCatalog: item.visibleInCatalog,
        }}
      />
      <div className="mx-auto max-w-2xl">
        <DeleteInstrumentButton id={item.id} titulo={item.titulo} />
      </div>
    </div>
  );
}
