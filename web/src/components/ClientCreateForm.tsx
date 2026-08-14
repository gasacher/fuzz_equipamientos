"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ClientCreateForm({ compact }: { compact?: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(!compact);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        email: fd.get("email"),
        phone: fd.get("phone"),
        notes: fd.get("notes"),
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "No se pudo crear");
      return;
    }
    const data = await res.json();
    router.push(`/admin/clientes/${data.id}`);
    router.refresh();
  }

  if (compact && !open) {
    return (
      <button type="button" className="btn-fuzz" onClick={() => setOpen(true)}>
        + Nuevo cliente
      </button>
    );
  }

  return (
    <form onSubmit={onCreate} className="fuzz-card space-y-4 p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="fuzz-title text-lg">Nuevo cliente</h2>
        {compact && (
          <button
            type="button"
            className="text-sm text-[#9c9c9c] hover:text-white"
            onClick={() => setOpen(false)}
          >
            Cancelar
          </button>
        )}
      </div>
      {error && <p className="text-sm text-[#e50914]">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1 sm:col-span-2">
          <span className="text-xs text-[#9c9c9c]">Nombre / empresa *</span>
          <input name="name" required className="fuzz-input" />
        </label>
        <label className="block space-y-1">
          <span className="text-xs text-[#9c9c9c]">Teléfono</span>
          <input name="phone" className="fuzz-input" />
        </label>
        <label className="block space-y-1">
          <span className="text-xs text-[#9c9c9c]">Email</span>
          <input name="email" type="email" className="fuzz-input" />
        </label>
        <label className="block space-y-1 sm:col-span-2">
          <span className="text-xs text-[#9c9c9c]">Notas internas</span>
          <textarea name="notes" rows={2} className="fuzz-input" />
        </label>
      </div>
      <button type="submit" className="btn-fuzz" disabled={loading}>
        {loading ? "Creando..." : "Crear y abrir perfil"}
      </button>
    </form>
  );
}
