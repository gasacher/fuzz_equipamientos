"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { buildWhatsAppConsultUrl } from "@/lib/fuzz";
import { appPath, withBasePath } from "@/lib/site-path";

const SLIDES = [
  { src: "/assets/img/hero-fuzz.jpg", alt: "Showroom FUZZ Equipamientos" },
  { src: "/assets/catalog/guitarra_negra.jpeg", alt: "Guitarras" },
  { src: "/assets/catalog/bajo.jpeg", alt: "Bajos" },
  { src: "/assets/catalog/amplificador.jpeg", alt: "Amplificadores" },
  { src: "/assets/catalog/bateria.jpeg", alt: "Baterías" },
  { src: "/assets/catalog/piano.jpeg", alt: "Teclados" },
  { src: "/assets/catalog/microfono.jpeg", alt: "Micrófonos" },
].map((slide) => ({ ...slide, src: withBasePath(slide.src) }));

export function CatalogHeroBanner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[min(68vh,540px)] min-h-[280px] w-full overflow-hidden">
      {SLIDES.map((slide, slideIndex) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={slide.src}
          src={slide.src}
          alt={slideIndex === index ? slide.alt : ""}
          className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${
            slideIndex === index ? "opacity-100" : "opacity-0"
          }`}
          fetchPriority={slideIndex === 0 ? "high" : "low"}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/25" />

      <div className="absolute inset-0 flex flex-col items-center justify-end px-4 pb-10 text-center md:pb-14">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e50914]">
          FUZZ Equipamientos · Buenos Aires
        </p>
        <h1 className="fuzz-title mt-3 max-w-3xl text-4xl text-white md:text-6xl">
          Catálogo en el showroom
        </h1>
        <p className="mt-3 max-w-xl text-sm text-white/80 md:text-base">
          Guitarras, amps y backline en consignación. Precio de referencia en USD.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href={appPath("/showroom")} className="btn-fuzz">
            Agendar visita
          </Link>
          <a
            href={buildWhatsAppConsultUrl("el catálogo FUZZ")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-fuzz-outline bg-black/40"
          >
            Escribinos por WhatsApp
          </a>
        </div>
        <div className="mt-6 flex gap-2">
          {SLIDES.map((slide, slideIndex) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`Ver ${slide.alt}`}
              onClick={() => setIndex(slideIndex)}
              className={`h-1.5 rounded-full transition ${
                slideIndex === index ? "w-6 bg-[#e50914]" : "w-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
