"use client";

import { FuzzLogo } from "@/components/FuzzLogo";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login/", {
      credentials: "include",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Error de acceso");
      return;
    }
    const data = await res.json();
    router.push(data.redirect);
    router.refresh();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="fuzz-card w-full max-w-md p-8">
        <div className="mb-4 flex justify-center">
          <FuzzLogo size="login" href="/" />
        </div>
        <h1 className="fuzz-title mb-2 text-center text-xl text-[#9c9c9c]">Admin</h1>
        <p className="mb-6 text-center text-sm text-[#9c9c9c]">
          Stock y ventas. El{" "}
          <a href="/" className="text-[#e50914] hover:underline">
            catálogo público
          </a>{" "}
          no requiere login.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block space-y-1">
            <span className="text-xs text-[#9c9c9c]">Email</span>
            <input
              type="email"
              required
              className="fuzz-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs text-[#9c9c9c]">Contraseña</span>
            <input
              type="password"
              required
              className="fuzz-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {error && <p className="text-sm text-[#e50914]">{error}</p>}
          <button type="submit" className="btn-fuzz w-full" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </main>
  );
}
