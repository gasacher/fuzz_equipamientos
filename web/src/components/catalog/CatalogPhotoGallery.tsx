"use client";

import Image from "next/image";
import { useState } from "react";
import { isExternalImage } from "@/lib/catalog-images";

function FrameImage({ src, alt, priority }: { src: string; alt: string; priority?: boolean }) {
  if (isExternalImage(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className="aspect-[4/3] w-full object-cover" />
    );
  }
  return (
    <div className="relative aspect-[4/3] w-full">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        priority={priority}
        sizes="(max-width:1024px) 100vw, 50vw"
      />
    </div>
  );
}

function Thumb({ src }: { src: string }) {
  if (isExternalImage(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt="" className="h-full w-full object-cover" />
    );
  }
  return <Image src={src} alt="" fill className="object-cover" sizes="64px" />;
}

/** Fotos del mismo post, en el marco 4/3 que ya usa la ficha. */
export function CatalogPhotoGallery({
  photos,
  alt,
  initialIndex = 0,
}: {
  photos: string[];
  alt: string;
  initialIndex?: number;
}) {
  const start = initialIndex >= 0 && initialIndex < photos.length ? initialIndex : 0;
  const [index, setIndex] = useState(start);
  const safeIndex = index >= 0 && index < photos.length ? index : 0;
  const src = photos[safeIndex] ?? photos[0];
  const hasMany = photos.length > 1;

  const go = (delta: number) => {
    setIndex((current) => {
      const base = current >= 0 && current < photos.length ? current : 0;
      return (base + delta + photos.length) % photos.length;
    });
  };

  if (!src) return null;

  return (
    <div>
      <div className="relative overflow-hidden rounded-xl border border-[#1f1f1f] bg-[#0f0f0f]">
        <FrameImage
          src={src}
          alt={hasMany ? `${alt} (${safeIndex + 1} de ${photos.length})` : alt}
          priority={safeIndex === start}
        />
        <span className="absolute left-3 top-3 rounded bg-[#e50914] px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
          Venta
        </span>
        {hasMany && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Foto anterior"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/75 px-2.5 py-1 text-lg leading-none text-white hover:bg-[#e50914]"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Foto siguiente"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/75 px-2.5 py-1 text-lg leading-none text-white hover:bg-[#e50914]"
            >
              ›
            </button>
          </>
        )}
      </div>
      {hasMany && (
        <div className="mt-2 flex gap-2 overflow-x-auto">
          {photos.map((photo, photoIndex) => {
            const selected = photoIndex === safeIndex;
            return (
              <button
                key={`${photoIndex}-${photo}`}
                type="button"
                onClick={() => setIndex(photoIndex)}
                aria-label={`Foto ${photoIndex + 1}`}
                aria-current={selected ? "true" : undefined}
                className={`relative aspect-[4/3] w-16 shrink-0 overflow-hidden rounded-md border bg-[#0f0f0f] ${
                  selected ? "border-[#e50914]" : "border-[#1f1f1f]"
                }`}
              >
                <Thumb src={photo} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
