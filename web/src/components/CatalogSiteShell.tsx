"use client";

import { WhatsAppFloating } from "@/components/catalog/WhatsAppButton";
import { DemoPublicNav } from "@/components/DemoPublicNav";
import { FuzzSiteFooter } from "@/components/FuzzSiteFooter";
import { usePathname } from "next/navigation";

export function CatalogSiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname.includes("/showroom") ? "showroom" : "catalog";

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <DemoPublicNav active={active} />
      <main className="flex-1">{children}</main>
      <FuzzSiteFooter />
      <WhatsAppFloating />
    </div>
  );
}
