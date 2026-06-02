import Link from "next/link";
import { FuzzLogo } from "@/components/FuzzLogo";
import { buildWhatsAppConsultUrl } from "@/lib/fuzz";
import { appPath, isStaticCatalogSite } from "@/lib/site-path";

type Props = {
  active: "catalog" | "panel";
};

export function DemoPublicNav({ active }: Props) {
  const catalogHref = appPath("/");
  const panelHref = appPath("/panel/");

  return (
    <nav className="border-b border-white/10 bg-black">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6 md:py-4">
        <FuzzLogo size="bar" href={catalogHref} />
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <Link
            href={catalogHref}
            className={`text-xs md:text-sm ${
              active === "catalog" ? "font-semibold text-[#e50914]" : "text-[#9c9c9c] hover:text-white"
            }`}
          >
            Catálogo público
          </Link>
          <Link
            href={panelHref}
            className={`text-xs md:text-sm ${
              active === "panel" ? "font-semibold text-[#e50914]" : "text-[#9c9c9c] hover:text-white"
            }`}
          >
            Panel admin (demo)
          </Link>
          {isStaticCatalogSite() ? (
            <a
              href={buildWhatsAppConsultUrl("consulta web FUZZ")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#9c9c9c] hover:text-[#e50914] md:text-sm"
            >
              WhatsApp
            </a>
          ) : (
            <Link href="/login" className="text-xs text-[#9c9c9c] hover:text-white md:text-sm">
              Acceso admin
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
