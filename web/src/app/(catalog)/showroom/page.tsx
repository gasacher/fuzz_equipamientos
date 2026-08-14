import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { ShowroomBookingForm } from "@/components/showroom/ShowroomBookingForm";
import { buildWhatsAppConsultUrl } from "@/lib/fuzz";
import { appPath, isStaticCatalogSite } from "@/lib/site-path";

export const metadata: Metadata = {
  title: "Agendar visita | FUZZ",
  description: "Reservá tu visita al showroom FUZZ. Lun–vie, 11 a 19 h.",
};

export default function ShowroomPage() {
  if (isStaticCatalogSite()) {
    return (
      <div className="mx-auto max-w-lg space-y-6 text-center">
        <h1 className="fuzz-title text-3xl">Visitar el showroom</h1>
        <p className="text-sm text-[#9c9c9c]">
          El agendamiento online está disponible en la versión completa del sitio. Por ahora
          coordiná tu visita por WhatsApp (lun–vie, 11 a 19 h).
        </p>
        <a
          href={buildWhatsAppConsultUrl("agendar visita al showroom FUZZ")}
          target="_blank"
          rel="noreferrer"
          className="btn-fuzz inline-block"
        >
          Agendar por WhatsApp
        </a>
        <Link href={appPath("/catalogo")} className="block text-sm text-[#9c9c9c] hover:text-white">
          ← Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="fuzz-title text-3xl md:text-4xl">Agendar visita al showroom</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-[#9c9c9c] md:text-base">
          Elegí día y horario para conocer el local. Visitá el showroom completo o contanos si venís
          por un instrumento en particular.
        </p>
      </header>

      <Suspense
        fallback={<p className="text-center text-sm text-[#9c9c9c]">Cargando formulario…</p>}
      >
        <ShowroomBookingForm />
      </Suspense>
    </div>
  );
}