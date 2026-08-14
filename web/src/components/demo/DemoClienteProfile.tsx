"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DemoContractsCard } from "@/components/demo/DemoContractsCard";
import { DemoInventarioTable } from "@/components/demo/DemoInventarioTable";
import type { InstrumentRow } from "@/components/InstrumentTable";
import {
  applyDemoClientEdit,
  saveDemoClientEdit,
} from "@/lib/demo-client-storage";
import { panelDemoPath } from "@/lib/panel-demo-path";

type Contract = {
  id: string;
  title: string;
  type: string;
  signedAt: string;
};

type Props = {
  client: {
    id: string;
    clientNumber: string;
    name: string;
    phone: string | null;
    email: string | null;
    notes: string | null;
    instrumentCount: number;
    contracts: Contract[];
    instruments: InstrumentRow[];
  };
};

export function DemoClienteProfile({ client }: Props) {
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState(client.name);
  const [clientNumber, setClientNumber] = useState(client.clientNumber ?? "");
  const [phone, setPhone] = useState(client.phone ?? "");
  const [email, setEmail] = useState(client.email ?? "");
  const [notes, setNotes] = useState(client.notes ?? "");

  useEffect(() => {
    const current = applyDemoClientEdit(client);
    setName(current.name);
    setClientNumber(current.clientNumber ?? "");
    setPhone(current.phone ?? "");
    setEmail(current.email ?? "");
    setNotes(current.notes ?? "");
  }, [client]);

  function onSave(e: React.FormEvent) {
    e.preventDefault();
    saveDemoClientEdit(client.id, {
      name: name.trim() || client.name,
      clientNumber: clientNumber.trim() || client.clientNumber,
      phone: phone.trim(),
      email: email.trim(),
      notes: notes.trim(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-8">
      <div>
        <Link href={panelDemoPath("/clientes")} className="text-sm text-[#9c9c9c] hover:text-white">
          ← Clientes
        </Link>
        <div className="mt-2 flex flex-wrap items-end gap-3">
          <h1 className="fuzz-title text-3xl">{name.trim() || client.name}</h1>
          <span className="rounded border border-[#e50914]/40 bg-[#1a0a0a] px-3 py-1 font-mono text-sm text-[#e50914]">
            {clientNumber || client.clientNumber}
          </span>
        </div>
      </div>

      <form onSubmit={onSave} className="fuzz-card space-y-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#9c9c9c]">
              Datos personales y contacto
            </h2>
            <p className="mt-1 text-xs text-[#9c9c9c]">
              Editá nombre, teléfono, email y notas. Guardá para que quede en el perfil.
            </p>
          </div>
          <button type="submit" className="btn-fuzz text-sm">
            {saved ? "Guardado ✓" : "Guardar datos"}
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block space-y-1 sm:col-span-2">
            <span className="text-xs text-[#9c9c9c]">Nombre / apellido / empresa *</span>
            <input
              className="fuzz-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs text-[#9c9c9c]">Nº cliente FUZZ</span>
            <input
              className="fuzz-input"
              value={clientNumber}
              onChange={(e) => setClientNumber(e.target.value)}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs text-[#9c9c9c]">Teléfono / WhatsApp</span>
            <input
              className="fuzz-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+54 11 …"
            />
          </label>
          <label className="block space-y-1 sm:col-span-2">
            <span className="text-xs text-[#9c9c9c]">Email</span>
            <input
              className="fuzz-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="block space-y-1 sm:col-span-2 lg:col-span-4">
            <span className="text-xs text-[#9c9c9c]">Notas internas</span>
            <textarea
              className="fuzz-input"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>
        </div>
      </form>

      <DemoContractsCard
        clientId={client.id}
        clientName={name.trim() || client.name}
        seed={client.contracts}
      />

      <section className="space-y-4">
        <header>
          <h2 className="fuzz-title text-xl">Instrumentos del cliente</h2>
          <p className="text-sm text-[#9c9c9c]">
            {client.instrumentCount} equipos vinculados a {clientNumber || client.clientNumber}
          </p>
        </header>
        <DemoInventarioTable items={client.instruments} mergeSessionNew={false} />
      </section>
    </div>
  );
}
