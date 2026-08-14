import Link from "next/link";
import { appPath } from "@/lib/site-path";

export function CatalogPageHeader() {
  return (
    <header className="pb-2 text-center">
      <h1 className="fuzz-title text-3xl md:text-4xl">Catálogo</h1>
      <p className="mx-auto mt-2 max-w-xl text-sm text-[#9c9c9c] md:text-base">
        Instrumentos en venta con precio de referencia en USD. Consultá por WhatsApp o{" "}
        <Link href={appPath("/showroom")} className="text-[#e50914] hover:underline">
          agendá una visita al showroom
        </Link>
        .
      </p>
    </header>
  );
}
