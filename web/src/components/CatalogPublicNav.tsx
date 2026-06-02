import Link from "next/link";
import { FuzzLogo } from "@/components/FuzzLogo";
import { buildWhatsAppConsultUrl } from "@/lib/fuzz";
import { isStaticCatalogSite } from "@/lib/site-path";

export function CatalogPublicNav() {
  const staticSite = isStaticCatalogSite();

  return (
    <nav className="border-b border-white/10 bg-black">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-4">
        <FuzzLogo size="bar" href="/" />
        {staticSite ? (
          <div className="flex shrink-0 items-center gap-3">
            {process.env.NEXT_PUBLIC_FULL_APP_URL ? (
              <a
                href={`${process.env.NEXT_PUBLIC_FULL_APP_URL.replace(/\/$/, "")}/login`}
                className="text-xs text-[#e50914] hover:underline md:text-sm"
              >
                Panel admin
              </a>
            ) : null}
            <a
              href={buildWhatsAppConsultUrl("catálogo web")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#9c9c9c] hover:text-[#e50914] md:text-sm"
            >
              WhatsApp
            </a>
          </div>
        ) : (
          <Link href="/login" className="shrink-0 text-xs text-[#9c9c9c] hover:text-white md:text-sm">
            Acceso admin
          </Link>
        )}
      </div>
    </nav>
  );
}
