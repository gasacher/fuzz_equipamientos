"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ImportExcelButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function onImport() {
    if (
      !confirm(
        "Esto reemplazará todo el STOCK y todas las VENTAS con los datos del Excel. ¿Continuar?",
      )
    ) {
      return;
    }
    setLoading(true);
    setMsg("");
    const res = await fetch("/api/import", { method: "POST" });
    setLoading(false);
    if (!res.ok) {
      setMsg("Error al importar");
      return;
    }
    const data = await res.json().catch(() => ({}));
    setMsg(data.message ?? "Stock y ventas actualizados");
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" className="btn-fuzz-outline" onClick={onImport} disabled={loading}>
        {loading ? "Importando..." : "Reimportar Excel"}
      </button>
      {msg && <span className="text-sm text-[#9c9c9c]">{msg}</span>}
    </div>
  );
}
