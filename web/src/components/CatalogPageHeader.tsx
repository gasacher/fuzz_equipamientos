import Link from "next/link";
import { appPath } from "@/lib/site-path";
import { buildWhatsAppConsultUrl } from "@/lib/fuzz";

export function CatalogPageHeader() {
  return (
    <header className="relative overflow-hidden rounded-2xl border border-[#1c1c1c] bg-[#0a0a0a] px-6 py-10 md:px-12 md:py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e50914]">
        FUZZ Equipamientos · Buenos Aires
      </p>
      <h1 className="fuzz-title mt-3 max-w-2xl text-4xl text-white md:text-5xl">
        Catálogo en el showroom
      </h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#9c9c9c] md:text-base">
        Guitarras, amps y backline seleccionados. Precio de referencia en USD. Consultá por WhatsApp
        o pasá por el local lun–vie, 11 a 19 h.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={appPath("/showroom")} className="btn-fuzz">
          Agendar visita
        </Link>
        <a
          href={buildWhatsAppConsultUrl("el catálogo FUZZ")}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-fuzz-outline"
        >
          Escribinos por WhatsApp
        </a>
      </div>
    </header>
  );
}
