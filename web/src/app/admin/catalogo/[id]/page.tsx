import Link from "next/link";
import { CatalogProduct } from "@/components/catalog/CatalogProduct";
import { toProductData } from "@/lib/catalog";
import { catalogWhere } from "@/lib/catalog-visibility";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminCatalogProductPreviewPage({ params }: Props) {
  const { id } = await params;
  const product = await prisma.instrument.findFirst({
    where: { id, ...catalogWhere },
  });
  if (!product) notFound();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#1c1c1c] bg-[#111] px-4 py-3 text-sm">
        <span className="text-[#9c9c9c]">Vista previa — ficha pública</span>
        <Link href={`/admin/inventario/${id}`} className="text-[#e50914] hover:underline">
          Editar en inventario →
        </Link>
      </div>
      <div className="flex gap-3 text-sm">
        <a href={`/equipo/${id}`} target="_blank" rel="noreferrer" className="text-[#e50914] hover:underline">
          Abrir en sitio público →
        </a>
      </div>
      <CatalogProduct product={toProductData(product)} catalogBasePath="/" />
    </div>
  );
}
