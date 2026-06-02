import type { Metadata } from "next";
import { WhatsAppFloating } from "@/components/catalog/WhatsAppButton";
import { DemoPublicNav } from "@/components/DemoPublicNav";

export const metadata: Metadata = {
  title: "Catálogo | FUZZ",
  description: "Catálogo de instrumentos en venta. Precios de referencia del inventario.",
};

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black">
      <DemoPublicNav active="catalog" />
      <main className="mx-auto max-w-7xl px-4 py-8 pb-24">{children}</main>
      <footer className="border-t border-white/10 py-6 text-center text-sm text-[#9c9c9c]">
        © FUZZ · Buenos Aires
      </footer>
      <WhatsAppFloating />
    </div>
  );
}
