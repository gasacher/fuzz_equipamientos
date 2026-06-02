import { CatalogProduct } from "@/components/catalog/CatalogProduct";
import { toProductData } from "@/lib/catalog";
import { catalogWhere } from "@/lib/catalog-visibility";
import { prisma } from "@/lib/prisma";
import { withBasePath } from "@/lib/site-path";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  if (process.env.GITHUB_PAGES !== "true") return [];
  const items = await prisma.instrument.findMany({
    where: catalogWhere,
    select: { id: true },
  });
  return items.map((item) => ({ id: item.id }));
}

export default async function CatalogProductPage({ params }: Props) {
  const { id } = await params;
  const product = await prisma.instrument.findFirst({
    where: { id, ...catalogWhere },
  });
  if (!product) notFound();

  return <CatalogProduct product={toProductData(product)} catalogBasePath={withBasePath("/")} />;
}
