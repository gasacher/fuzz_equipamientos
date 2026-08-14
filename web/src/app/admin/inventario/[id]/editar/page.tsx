import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteInstrumentButton } from "@/components/DeleteInstrumentButton";
import { InstrumentForm } from "@/components/InstrumentForm";
import { getInstrumentTaxonomy } from "@/lib/get-taxonomy";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export default async function AdminEditarInstrumentoPage({ params }: Props) {
  const { id } = await params;
  const [item, taxonomy] = await Promise.all([
    prisma.instrument.findUnique({ where: { id } }),
    getInstrumentTaxonomy(),
  ]);

  if (!item) notFound();

  return (
    <div className="space-y-4">
      <Link href={`/admin/inventario/${id}`} className="text-sm text-[#9c9c9c] hover:text-white">
        ← Ver producto
      </Link>
      <InstrumentForm
        taxonomy={taxonomy}
        showTraceability
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
          fb: item.fb,
          ml: item.ml,
          imageUrl: item.imageUrl,
          descripcion: item.descripcion,
          visibleInCatalog: item.visibleInCatalog,
          status: item.status,
          location: item.location,
          buyer: item.buyer,
          receiptName: item.receiptName,
          receiptPath: item.receiptPath,
        }}
      />
      <div className="mx-auto max-w-2xl">
        <DeleteInstrumentButton id={item.id} titulo={item.titulo} />
      </div>
    </div>
  );
}
