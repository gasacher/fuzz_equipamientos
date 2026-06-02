import { CatalogProduct } from "@/components/catalog/CatalogProduct";
import { fetchCatalogIds, fetchCatalogProduct } from "@/lib/catalog-store";
import { withBasePath } from "@/lib/site-path";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  if (process.env.GITHUB_PAGES !== "true") return [];
  const ids = await fetchCatalogIds();
  return ids.map((id) => ({ id }));
}

export default async function CatalogProductPage({ params }: Props) {
  const { id } = await params;
  const product = await fetchCatalogProduct(id);
  if (!product) notFound();

  return <CatalogProduct product={product} catalogBasePath={withBasePath("/")} />;
}
