export const dynamic = "force-dynamic";

import Link from "next/link";
import { CatalogProduct } from "@/components/catalog/CatalogProduct";
import { fetchCatalogProduct } from "@/lib/catalog-store";
import { withBasePath } from "@/lib/site-path";

type Props = {
  searchParams: Promise<{ id?: string }>;
};

export default async function EquipoPage({ searchParams }: Props) {
  const { id } = await searchParams;

  if (!id) {
    return (
      <div className="fuzz-card space-y-4 p-8 text-center">
        <p className="text-[#9c9c9c]">Producto no encontrado.</p>
        <Link href={withBasePath("/")} className="text-[#e50914] hover:underline">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const product = await fetchCatalogProduct(id);

  if (!product) {
    return (
      <div className="fuzz-card space-y-4 p-8 text-center">
        <p className="text-[#9c9c9c]">Producto no encontrado.</p>
        <Link href={withBasePath("/")} className="text-[#e50914] hover:underline">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  return <CatalogProduct product={product} catalogBasePath={withBasePath("/")} />;
}
