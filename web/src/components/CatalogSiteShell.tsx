"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WhatsAppFloating } from "@/components/catalog/WhatsAppButton";
import { DemoPublicNav } from "@/components/DemoPublicNav";
import { buildWhatsAppConsultUrl } from "@/lib/fuzz";
import { appPath } from "@/lib/site-path";

export function CatalogSiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname.includes("/showroom") ? "showroom" : "catalog";

  return (
    <div className="min-h-screen bg-black">
      <DemoPublicNav active={active} />
      <main className="mx-auto max-w-7xl px-4 py-8 pb-24">{children}</main>
      <footer className="border-t border-white/10">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-3">
          <div>
            <p className="fuzz-title text-lg text-white">FUZZ</p>
            <p className="mt-2 text-sm text-[#9c9c9c]">
              Equipamientos y backline en Buenos Aires. Showroom con visita coordinada.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#9c9c9c]">Showroom</p>
            <p className="mt-2 text-sm text-[#f2f2f2]">Lunes a viernes · 11 a 19 h</p>
            <Link
              href={appPath("/showroom")}
              className="mt-2 inline-block text-sm text-[#e50914] hover:underline"
            >
              Agendar una visita
            </Link>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#9c9c9c]">Consulta</p>
            <a
              href={buildWhatsAppConsultUrl("el catálogo FUZZ")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm text-[#e50914] hover:underline"
            >
              WhatsApp
            </a>
            <p className="mt-2 text-xs text-[#9c9c9c]">Precios de referencia en USD.</p>
          </div>
        </div>
        <p className="border-t border-white/10 py-4 text-center text-xs text-[#9c9c9c]">
          © FUZZ · Buenos Aires
        </p>
      </footer>
      <WhatsAppFloating />
    </div>
  );
}
