import Link from "next/link";
import { FuzzLogo } from "@/components/FuzzLogo";
import {
  buildWhatsAppConsultUrl,
  FUZZ_EMAIL,
  FUZZ_HOURS,
  FUZZ_INSTAGRAM_HANDLE,
  FUZZ_INSTAGRAM_URL,
  FUZZ_LOCATION,
} from "@/lib/fuzz";
import { appPath } from "@/lib/site-path";

type Props = {
  catalogHref?: string;
  showroomHref?: string;
  note?: string;
};

export function FuzzSiteFooter({
  catalogHref = appPath("/catalogo"),
  showroomHref = appPath("/showroom"),
  note,
}: Props) {
  return (
    <footer className="border-t border-white/10 bg-[#0a0a0a]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <FuzzLogo size="footer" href={catalogHref} />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#9c9c9c]">
            Equipamientos y backline en consignación. Showroom con visita coordinada.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#9c9c9c]">Showroom</p>
          <p className="mt-3 text-sm text-[#f2f2f2]">{FUZZ_LOCATION}</p>
          <p className="mt-1 text-sm text-[#f2f2f2]">{FUZZ_HOURS}</p>
          <Link href={showroomHref} className="mt-3 inline-block text-sm text-[#e50914] hover:underline">
            Agendar una visita
          </Link>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#9c9c9c]">Catálogo</p>
          <Link href={catalogHref} className="mt-3 block text-sm text-[#f2f2f2] hover:text-white">
            Ver equipos
          </Link>
          <Link href={showroomHref} className="mt-2 block text-sm text-[#f2f2f2] hover:text-white">
            Visitar el local
          </Link>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#9c9c9c]">Contacto</p>
          <a
            href={buildWhatsAppConsultUrl("el catálogo FUZZ")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 block text-sm text-[#e50914] hover:underline"
          >
            WhatsApp
          </a>
          <a href={`mailto:${FUZZ_EMAIL}`} className="mt-2 block text-sm text-[#f2f2f2] hover:text-white">
            {FUZZ_EMAIL}
          </a>
          <a
            href={FUZZ_INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block text-sm text-[#f2f2f2] hover:text-white"
          >
            Instagram {FUZZ_INSTAGRAM_HANDLE}
          </a>
          <p className="mt-3 text-xs text-[#9c9c9c]">Precios de referencia en USD.</p>
        </div>
      </div>
      <p className="border-t border-white/10 py-4 text-center text-xs text-[#9c9c9c]">
        © FUZZ Equipamientos · {FUZZ_LOCATION}
        {note ? ` · ${note}` : ""}
      </p>
    </footer>
  );
}
