import Link from "next/link";
import { notFound } from "next/navigation";
import { InstrumentForm } from "@/components/InstrumentForm";
import { DemoFormBanner } from "@/components/demo/DemoFormBanner";
import {
  demoInstrumentStaticParams,
  getDemoInstrument,
  getDemoTaxonomyForInstrument,
} from "@/lib/demo-admin";
import { panelDemoPath } from "@/lib/panel-demo-path";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return demoInstrumentStaticParams();
}

export default async function DemoEditarInstrumentoPage({ params }: Props) {
  const { id } = await params;
  const item = getDemoInstrument(id);
  if (!item) notFound();

  const listHref = panelDemoPath("/inventario");
  const taxonomy = getDemoTaxonomyForInstrument(item.categoria, item.subcategoria);

  return (
    <div className="space-y-4">
      <Link href={listHref} className="text-sm text-[#9c9c9c] hover:text-white">
        ← Inventario
      </Link>
      <DemoFormBanner />
      <InstrumentForm
        taxonomy={taxonomy}
        demoMode
        listHref={listHref}
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
          imageUrl: null,
          descripcion: null,
          visibleInCatalog: item.visibleInCatalog ?? true,
        }}
      />
    </div>
  );
}
