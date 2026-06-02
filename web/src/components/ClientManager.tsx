"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ClientRow = {
  id: string;
  name: string;
  email: string | null;
  _count: { instruments: number; users: number };
  users: { email: string; name: string }[];
};

export function ClientManager({ initial }: { initial: ClientRow[] }) {
  const router = useRouter();
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
        contactEmail: fd.get("contactEmail"),
        phone: fd.get("phone"),
        userName: fd.get("userName"),
        email: fd.get("email"),
        password: fd.get("password"),
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "No se pudo crear");
      return;
    }
    e.currentTarget.reset();
    router.refresh();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={onCreate} className="fuzz-card space-y-4 p-6">
        <h2 className="fuzz-title text-lg">Nuevo acceso de cliente</h2>
        {error && <p className="text-sm text-[#e50914]">{error}</p>}
        <label className="block space-y-1">
          <span className="text-xs text-[#9c9c9c]">Nombre / empresa (referencia interna) *</span>
          <input name="name" required className="fuzz-input" />
        </label>
        <label className="block space-y-1">
          <span className="text-xs text-[#9c9c9c]">Email de contacto</span>
          <input name="contactEmail" type="email" className="fuzz-input" />
        </label>
        <label className="block space-y-1">
          <span className="text-xs text-[#9c9c9c]">Teléfono</span>
          <input name="phone" className="fuzz-input" />
        </label>
        <hr className="border-[#1c1c1c]" />
        <p className="text-xs text-[#9c9c9c]">Usuario portal (opcional)</p>
        <label className="block space-y-1">
          <span className="text-xs text-[#9c9c9c]">Nombre usuario</span>
          <input name="userName" className="fuzz-input" />
        </label>
        <label className="block space-y-1">
          <span className="text-xs text-[#9c9c9c]">Email login</span>
          <input name="email" type="email" className="fuzz-input" />
        </label>
        <label className="block space-y-1">
          <span className="text-xs text-[#9c9c9c]">Contraseña</span>
          <input name="password" type="password" className="fuzz-input" />
        </label>
        <button type="submit" className="btn-fuzz" disabled={loading}>
          {loading ? "Creando..." : "Crear cliente"}
        </button>
      </form>

      <div className="fuzz-card overflow-hidden">
        <table className="fuzz-table w-full text-sm">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Items</th>
              <th>Usuarios</th>
            </tr>
          </thead>
          <tbody>
            {initial.map((c) => (
              <tr key={c.id}>
                <td>
                  <p className="font-medium text-white">{c.name}</p>
                  {c.users[0] && (
                    <p className="text-xs text-[#9c9c9c]">{c.users[0].email}</p>
                  )}
                </td>
                <td>{c._count.instruments}</td>
                <td>{c._count.users}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
