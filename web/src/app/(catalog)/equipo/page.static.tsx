"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CatalogProduct } from "@/components/catalog/CatalogProduct";
import catalogData from "@/data/catalog.json";
import { appPath } from "@/lib/site-path";

function ProductContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const product = id ? catalogData.items.find((item) => item.id === id) : null;

  if (!id || !product) {
    return (
      <div className="fuzz-card space-y-4 p-8 text-center">
        <p className="text-[#9c9c9c]">Producto no encontrado.</p>
        <Link href={appPath("/")} className="text-[#e50914] hover:underline">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  return <CatalogProduct product={product} catalogBasePath={appPath("/")} />;
}

export default function EquipoPageStatic() {
  return (
    <Suspense fallback={<p className="text-center text-[#9c9c9c]">Cargando…</p>}>
      <ProductContent />
    </Suspense>
  );
}
