"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = { id: string; titulo: string };

export function DeleteSaleButton({ id, titulo }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onDelete() {
    if (!confirm(`¿Eliminar venta "${titulo}"?`)) return;
    setLoading(true);
    await fetch(`/api/sales/${id}`, { method: "DELETE" });
    setLoading(false);
    router.push("/admin/ventas");
    router.refresh();
  }

  return (
    <button type="button" className="btn-fuzz-outline text-[#e50914]" onClick={onDelete} disabled={loading}>
      {loading ? "Eliminando..." : "Eliminar venta"}
    </button>
  );
}
