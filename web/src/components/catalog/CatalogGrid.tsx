"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { getInstrumentImage, isExternalImage } from "@/lib/catalog-images";
import { formatCatalogPrice } from "@/lib/format-price";
import { appPath } from "@/lib/site-path";

export type CatalogItem = {
  id: string;
  titulo: string;
  categoria: string;
  subcategoria: string | null;
  marca: string | null;
  anio: string | null;
  imageUrl: string | null;
  valorUsd: number | null;
};

type Props = {
  items: CatalogItem[];
  /** Ruta base para fichas de producto, ej. /equipo */
  basePath?: string;
};

function CatalogImage({ src, alt }: { src: string; alt: string }) {
  if (isExternalImage(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
    );
  }
  return <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width:768px) 50vw, 25vw" />;
}

export function CatalogGrid({ items, basePath = appPath("/equipo") }: Props) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [marca, setMarca] = useState("");

  const categories = useMemo(
    () => [...new Set(items.map((i) => i.categoria))].sort(),
    [items],
  );
  const marcas = useMemo(
    () => [...new Set(items.map((i) => i.marca).filter(Boolean) as string[])].sort(),
    [items],
  );

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return items.filter((i) => {
      if (cat && i.categoria !== cat) return false;
      if (marca && i.marca !== marca) return false;
      if (!term) return true;
      const hay = `${i.titulo} ${i.marca ?? ""} ${i.subcategoria ?? ""} ${i.categoria}`.toLowerCase();
      return hay.includes(term);
    });
  }, [items, q, cat, marca]);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block space-y-1 lg:col-span-2">
          <span className="text-xs text-[#9c9c9c]">Buscar</span>
          <input
            className="fuzz-input"
            placeholder="Modelo, marca, categoría…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <label className="block space-y-1">
          <span className="text-xs text-[#9c9c9c]">Categoría</span>
          <select className="fuzz-input" value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="">Todas</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-1">
          <span className="text-xs text-[#9c9c9c]">Marca</span>
          <select className="fuzz-input" value={marca} onChange={(e) => setMarca(e.target.value)}>
            <option value="">Todas</option>
            {marcas.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="text-sm text-[#9c9c9c]">
        {filtered.length} de {items.length} equipos
      </p>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-[#9c9c9c]">No hay resultados con esos filtros.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item) => {
            const img = getInstrumentImage(item.categoria, item.imageUrl);
            return (
              <article
                key={item.id}
                className="catalog-card group flex flex-col overflow-hidden rounded-xl border border-[#1c1c1c] bg-[#111] transition hover:border-[#e50914]"
              >
                <Link href={`${basePath}?id=${item.id}`} className="relative aspect-[4/3] overflow-hidden bg-[#0f0f0f]">
                  <CatalogImage src={img} alt={item.titulo} />
                  <span className="absolute left-2 top-2 rounded bg-[#e50914] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                    Venta
                  </span>
                </Link>
                <div className="flex flex-1 flex-col p-3">
                  <h2 className="line-clamp-2 text-sm font-semibold leading-snug text-white">
                    <Link href={`${basePath}?id=${item.id}`} className="hover:text-[#e50914]">
                      {item.titulo}
                    </Link>
                  </h2>
                  <p className="mt-1 text-xs text-[#9c9c9c]">
                    {item.categoria}
                    {item.marca ? ` · ${item.marca}` : ""}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[#e50914]">
                    {formatCatalogPrice(item.valorUsd)}
                  </p>
                  <div className="mt-auto flex flex-col gap-2 pt-3">
                    <Link href={`${basePath}?id=${item.id}`} className="btn-fuzz-outline w-full py-2 text-center text-xs">
                      Ver detalle
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
