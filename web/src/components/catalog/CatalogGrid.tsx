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
  showFeatured?: boolean;
};

function CatalogImage({ src, alt }: { src: string; alt: string }) {
  if (isExternalImage(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        loading="lazy"
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover transition duration-300 group-hover:scale-105"
      sizes="(max-width:768px) 50vw, 25vw"
    />
  );
}

function ProductCard({
  item,
  href,
}: {
  item: CatalogItem;
  href: string;
}) {
  const img = getInstrumentImage(item.categoria, item.imageUrl);
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-[#1c1c1c] bg-[#111] transition hover:border-[#e50914]">
      <Link href={href} className="relative aspect-[4/3] overflow-hidden bg-[#0f0f0f]">
        <CatalogImage src={img} alt={item.titulo} />
        <span className="absolute left-2 top-2 rounded bg-black/75 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
          {item.categoria}
        </span>
        <span className="absolute inset-x-0 bottom-0 bg-black/80 px-3 py-3 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
          Ver equipo →
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-3">
        <h2 className="line-clamp-2 text-sm font-semibold leading-snug text-white">
          <Link href={href} className="hover:text-[#e50914]">
            {item.titulo}
          </Link>
        </h2>
        <p className="mt-1 text-xs text-[#9c9c9c]">
          {item.marca ?? item.subcategoria ?? "Consultar detalle"}
          {item.anio ? ` · ${item.anio}` : ""}
        </p>
        <p className="mt-3 text-base font-semibold text-[#e50914]">
          {formatCatalogPrice(item.valorUsd)}
        </p>
      </div>
    </article>
  );
}

export function CatalogGrid({
  items,
  basePath = appPath("/equipo"),
  showFeatured = true,
}: Props) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [marca, setMarca] = useState("");

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of items) {
      counts.set(item.categoria, (counts.get(item.categoria) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [items]);

  const marcas = useMemo(
    () => [...new Set(items.map((i) => i.marca).filter(Boolean) as string[])].sort(),
    [items],
  );

  const featured = useMemo(() => {
    if (!showFeatured) return [];
    return [...items]
      .filter((item) => item.valorUsd != null)
      .sort((a, b) => (b.valorUsd ?? 0) - (a.valorUsd ?? 0))
      .slice(0, 4);
  }, [items, showFeatured]);

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

  const browsingAll = !q && !cat && !marca;

  return (
    <div className="space-y-10">
      {browsingAll && featured.length > 0 && (
        <section className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e50914]">
              En el showroom
            </p>
            <h2 className="fuzz-title mt-1 text-2xl text-white">Destacados</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {featured.map((item) => (
              <ProductCard
                key={`feat-${item.id}`}
                item={item}
                href={`${basePath}?id=${item.id}`}
              />
            ))}
          </div>
        </section>
      )}

      <section className="space-y-6">
        {browsingAll && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e50914]">
              Catálogo
            </p>
            <h2 className="fuzz-title mt-1 text-2xl text-white">Todo el stock visible</h2>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCat("")}
            className={`rounded-full border px-3 py-1.5 text-xs transition ${
              !cat
                ? "border-[#e50914] bg-[#1a0a0a] text-white"
                : "border-[#1c1c1c] text-[#9c9c9c] hover:border-[#333] hover:text-white"
            }`}
          >
            Todas · {items.length}
          </button>
          {categories.map(([name, count]) => (
            <button
              type="button"
              key={name}
              onClick={() => setCat(name === cat ? "" : name)}
              className={`rounded-full border px-3 py-1.5 text-xs transition ${
                cat === name
                  ? "border-[#e50914] bg-[#1a0a0a] text-white"
                  : "border-[#1c1c1c] text-[#9c9c9c] hover:border-[#333] hover:text-white"
              }`}
            >
              {name} · {count}
            </button>
          ))}
        </div>

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
            {filtered.map((item) => (
              <ProductCard key={item.id} item={item} href={`${basePath}?id=${item.id}`} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
