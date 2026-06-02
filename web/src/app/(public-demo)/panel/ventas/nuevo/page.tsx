import Link from "next/link";
import { SaleForm } from "@/components/SaleForm";
import { DemoFormBanner } from "@/components/demo/DemoFormBanner";
import { panelDemoPath } from "@/lib/panel-demo-path";

export default function DemoNuevaVentaPage() {
  const listHref = panelDemoPath("/ventas");

  return (
    <div className="space-y-4">
      <Link href={listHref} className="text-sm text-[#9c9c9c] hover:text-white">
        ← Ventas
      </Link>
      <DemoFormBanner />
      <SaleForm demoMode listHref={listHref} />
    </div>
  );
}
