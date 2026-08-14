"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { appPath } from "@/lib/site-path";

/** El catálogo del panel era un duplicado: la vista pública es /catalogo. */
export default function DemoCatalogoPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(appPath("/catalogo"));
  }, [router]);

  return <p className="text-sm text-[#9c9c9c]">Abriendo el catálogo web…</p>;
}
