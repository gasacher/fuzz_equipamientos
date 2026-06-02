import { CatalogProduct } from "@/components/catalog/CatalogProduct";
import { toProductData } from "@/lib/catalog";
import { catalogWhere } from "@/lib/catalog-visibility";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function CatalogProductPage({ params }: Props) {
  const { id } = await params;
  const product = await prisma.instrument.findFirst({
    where: { id, ...catalogWhere },
  });
  if (!product) notFound();

  return <CatalogProduct product={toProductData(product)} catalogBasePath="/" />;
}
