import { Suspense } from "react";
import type { Metadata } from "next";
import { CatalogContainer } from "@/components/CatalogContainer";
import { ShowroomBookingForm } from "@/components/showroom/ShowroomBookingForm";

export const metadata: Metadata = {
  title: "Agendar visita | FUZZ",
  description: "Reservá tu visita al showroom FUZZ. Lun–vie, 11 a 19 h.",
};

export default function ShowroomPage() {
  return (
    <CatalogContainer>
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
    </CatalogContainer>
  );
}
