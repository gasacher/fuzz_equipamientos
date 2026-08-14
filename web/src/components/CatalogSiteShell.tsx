"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WhatsAppFloating } from "@/components/catalog/WhatsAppButton";
import { DemoPublicNav } from "@/components/DemoPublicNav";
import { appPath, isStaticCatalogSite } from "@/lib/site-path";

export function CatalogSiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname.includes("/showroom") ? "showroom" : "catalog";

  return (
    <div className="min-h-screen bg-black">
      <DemoPublicNav active={active} />
      <main className="mx-auto max-w-7xl px-4 py-8 pb-24">
        {isStaticCatalogSite() && !pathname.includes("/showroom") && (
          <p className="mb-4 text-center text-xs text-[#9c9c9c]">
            <Link href={appPath("/")} className="text-[#e50914] hover:underline">
              ← Volver al inicio
            </Link>
          </p>
        )}
        {children}
      </main>
      <footer className="border-t border-white/10 py-6 text-center text-sm text-[#9c9c9c]">
        © FUZZ · Buenos Aires
      </footer>
      <WhatsAppFloating />
    </div>
  );
}
