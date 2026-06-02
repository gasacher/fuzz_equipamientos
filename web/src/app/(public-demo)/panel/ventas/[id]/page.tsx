import Link from "next/link";
import { notFound } from "next/navigation";
import { SaleForm } from "@/components/SaleForm";
import { DemoFormBanner } from "@/components/demo/DemoFormBanner";
import { demoSaleStaticParams, getDemoSale } from "@/lib/demo-admin";
import { panelDemoPath } from "@/lib/panel-demo-path";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return demoSaleStaticParams();
}

export default async function DemoEditarVentaPage({ params }: Props) {
  const { id } = await params;
  const sale = getDemoSale(id);
  if (!sale) notFound();

  const listHref = panelDemoPath("/ventas");

  return (
    <div className="space-y-4">
      <Link href={listHref} className="text-sm text-[#9c9c9c] hover:text-white">
        ← Ventas
      </Link>
      <DemoFormBanner />
      <SaleForm demoMode listHref={listHref} initial={sale} />
    </div>
  );
}
