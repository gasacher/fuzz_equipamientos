import Link from "next/link";
import { FuzzLogo } from "@/components/FuzzLogo";
import { buildWhatsAppConsultUrl } from "@/lib/fuzz";
import { appPath } from "@/lib/site-path";

type Props = {
  active: "catalog" | "showroom";
};

export function DemoPublicNav({ active }: Props) {
  const catalogHref = appPath("/catalogo");
  const showroomHref = appPath("/showroom");

  return (
    <nav className="border-b border-white/10 bg-black">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6 md:py-4">
        <FuzzLogo size="bar" href={catalogHref} />
        <div className="flex flex-wrap items-center gap-2 sm:gap-5">
          <Link
            href={catalogHref}
            className={`text-xs md:text-sm ${
              active === "catalog" ? "font-semibold text-white" : "text-[#9c9c9c] hover:text-white"
            }`}
          >
            Catálogo
          </Link>
          <Link
            href={showroomHref}
            className={`text-xs md:text-sm ${
              active === "showroom" ? "font-semibold text-white" : "text-[#9c9c9c] hover:text-white"
            }`}
          >
            Showroom
          </Link>
          <a
            href={buildWhatsAppConsultUrl("consulta catálogo FUZZ")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-fuzz px-3 py-1.5 text-xs md:text-sm"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </nav>
  );
}
