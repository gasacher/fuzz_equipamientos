import Link from "next/link";
import { InstrumentForm } from "@/components/InstrumentForm";
import { DemoFormBanner } from "@/components/demo/DemoFormBanner";
import { getDemoTaxonomy } from "@/lib/demo-admin";
import { panelDemoPath } from "@/lib/panel-demo-path";

export default function DemoNuevoInstrumentoPage() {
  const listHref = panelDemoPath("/inventario");

  return (
    <div className="space-y-4">
      <Link href={listHref} className="text-sm text-[#9c9c9c] hover:text-white">
        ← Inventario
      </Link>
      <DemoFormBanner />
      <InstrumentForm taxonomy={getDemoTaxonomy()} demoMode listHref={listHref} />
    </div>
  );
}
