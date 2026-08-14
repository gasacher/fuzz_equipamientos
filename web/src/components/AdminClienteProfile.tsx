"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminInventarioTable } from "@/components/AdminInventarioTable";
import { ContractFileField } from "@/components/ContractFileField";
import { formatDemoDate } from "@/lib/demo-features";
import { contractFilePath } from "@/lib/contract-file";
import { validateReceiptFile } from "@/lib/receipt-file";

type Contract = {
  id: string;
  title: string;
  type: string;
  signedAt: string;
  fileName: string | null;
  filePath: string | null;
};

type Instrument = {
  id: string;
  categoria: string;
  subcategoria: string | null;
  titulo: string;
  contacto: string | null;
  valorUsd: number | null;
  status: string;
  location: string | null;
};

type Props = {
  client: {
    id: string;
    clientNumber: string | null;
    name: string;
    email: string | null;
    phone: string | null;
    notes: string | null;
    contracts: Contract[];
    instruments: Instrument[];
  };
};

export function AdminClienteProfile({ client }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [contactSaved, setContactSaved] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [tab, setTab] = useState<"instrumentos" | "contratos">("instrumentos");
  const [contractFile, setContractFile] = useState<File | null>(null);
  const [contractFileError, setContractFileError] = useState<string>();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editFileError, setEditFileError] = useState<string>();
  const [editLoading, setEditLoading] = useState(false);

  async function onSaveContact(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setContactLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch(`/api/clients/${client.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        email: fd.get("email"),
        phone: fd.get("phone"),
        notes: fd.get("notes"),
      }),
    });
    setContactLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "No se pudo guardar el contacto");
      return;
    }
    setContactSaved(true);
    router.refresh();
    setTimeout(() => setContactSaved(false), 2000);
  }

  async function onAddContract(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (contractFile) {
      const fileErr = validateReceiptFile(contractFile);
      if (fileErr) {
        setContractFileError(fileErr);
        return;
      }
    }
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (contractFile) fd.set("file", contractFile);
    const res = await fetch(`/api/clients/${client.id}/contracts`, {
      method: "POST",
      body: fd,
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "No se pudo agregar contrato");
      return;
    }
    form.reset();
    setContractFile(null);
    setContractFileError(undefined);
    router.refresh();
  }

  async function onEditContract(e: React.FormEvent<HTMLFormElement>, contractId: string) {
    e.preventDefault();
    setError("");
    if (editFile) {
      const fileErr = validateReceiptFile(editFile);
      if (fileErr) {
        setEditFileError(fileErr);
        return;
      }
    }
    setEditLoading(true);
    const fd = new FormData(e.currentTarget);
    if (editFile) fd.set("file", editFile);
    const res = await fetch(`/api/clients/${client.id}/contracts/${contractId}`, {
      method: "PATCH",
      body: fd,
    });
    setEditLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "No se pudo guardar el contrato");
      return;
    }
    setEditingId(null);
    setEditFile(null);
    setEditFileError(undefined);
    router.refresh();
  }

  async function onDeleteContract(contractId: string) {
    setError("");
    const res = await fetch(`/api/clients/${client.id}/contracts/${contractId}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "No se pudo quitar el contrato");
      return;
    }
    if (editingId === contractId) setEditingId(null);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/clientes" className="text-sm text-[#9c9c9c] hover:text-white">
          ← Todos los clientes
        </Link>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-wrap items-end gap-3">
            <h1 className="fuzz-title text-3xl">{client.name}</h1>
            {client.clientNumber && (
              <span className="rounded border border-[#e50914]/40 bg-[#1a0a0a] px-3 py-1 font-mono text-sm text-[#e50914]">
                {client.clientNumber}
              </span>
            )}
          </div>
          <p className="text-sm text-[#9c9c9c]">
            {client.instruments.length} instrumento{client.instruments.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      {error && <p className="text-sm text-[#e50914]">{error}</p>}

      <form onSubmit={onSaveContact} className="fuzz-card space-y-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#9c9c9c]">
            Datos de contacto
          </h2>
          <button type="submit" className="btn-fuzz text-sm" disabled={contactLoading}>
            {contactSaved ? "Guardado ✓" : contactLoading ? "Guardando..." : "Guardar contacto"}
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block space-y-1 sm:col-span-2">
            <span className="text-xs text-[#9c9c9c]">Nombre / empresa</span>
            <input name="name" required defaultValue={client.name} className="fuzz-input" />
          </label>
          <label className="block space-y-1">
            <span className="text-xs text-[#9c9c9c]">Teléfono</span>
            <input name="phone" defaultValue={client.phone ?? ""} className="fuzz-input" />
          </label>
          <label className="block space-y-1">
            <span className="text-xs text-[#9c9c9c]">Email</span>
            <input name="email" type="email" defaultValue={client.email ?? ""} className="fuzz-input" />
          </label>
          <label className="block space-y-1 sm:col-span-2 lg:col-span-4">
            <span className="text-xs text-[#9c9c9c]">Notas internas</span>
            <textarea
              name="notes"
              rows={2}
              defaultValue={client.notes ?? ""}
              className="fuzz-input"
            />
          </label>
        </div>
        <p className="text-xs text-[#9c9c9c]">
          Si cambiás el nombre, se actualiza también en los instrumentos vinculados a este cliente.
        </p>
      </form>

      <div className="flex gap-2 border-b border-[#1c1c1c]">
        <button
          type="button"
          className={`px-4 py-2 text-sm ${tab === "instrumentos" ? "border-b-2 border-[#e50914] text-white" : "text-[#9c9c9c] hover:text-white"}`}
          onClick={() => setTab("instrumentos")}
        >
          Instrumentos ({client.instruments.length})
        </button>
        <button
          type="button"
          className={`px-4 py-2 text-sm ${tab === "contratos" ? "border-b-2 border-[#e50914] text-white" : "text-[#9c9c9c] hover:text-white"}`}
          onClick={() => setTab("contratos")}
        >
          Contratos ({client.contracts.length})
        </button>
      </div>

      {tab === "instrumentos" && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[#9c9c9c]">
              Stock de este cliente. Ver ficha o Editar trazabilidad y datos de cada equipo.
            </p>
            <Link href="/admin/inventario/nuevo" className="btn-fuzz-outline text-sm">
              + Ingresar producto
            </Link>
          </div>
          {client.instruments.length === 0 ? (
            <div className="fuzz-card p-8 text-center text-sm text-[#9c9c9c]">
              Este cliente aún no tiene instrumentos vinculados.
            </div>
          ) : (
            <AdminInventarioTable items={client.instruments} showFilters={false} />
          )}
        </section>
      )}

      {tab === "contratos" && (
        <div className="fuzz-card space-y-4 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#9c9c9c]">Contratos</h2>
          {client.contracts.length === 0 ? (
            <p className="text-sm text-[#9c9c9c]">Sin contratos cargados.</p>
          ) : (
            <ul className="space-y-3">
              {client.contracts.map((c) => (
                <li
                  key={c.id}
                  className="space-y-3 rounded-lg border border-[#1c1c1c] bg-[#0f0f0f] p-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">{c.title}</p>
                      <p className="text-xs text-[#9c9c9c]">
                        {c.type} · {formatDemoDate(c.signedAt)}
                      </p>
                      {c.fileName && (
                        <p className="mt-1 text-xs text-[#6fcf97]">Archivo: {c.fileName}</p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {c.filePath ? (
                        <a
                          href={contractFilePath(client.id, c.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-fuzz text-xs"
                        >
                          Ver PDF
                        </a>
                      ) : (
                        <span className="self-center text-xs text-[#9c9c9c]">Sin PDF</span>
                      )}
                      <button
                        type="button"
                        className="btn-fuzz-outline text-xs"
                        onClick={() => {
                          setEditingId(c.id);
                          setEditFile(null);
                          setEditFileError(undefined);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn-fuzz-outline text-xs"
                        onClick={() => onDeleteContract(c.id)}
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                  {editingId === c.id && (
                    <form
                      onSubmit={(e) => onEditContract(e, c.id)}
                      className="space-y-3 border-t border-[#1c1c1c] pt-3"
                    >
                      <input
                        name="title"
                        required
                        defaultValue={c.title}
                        className="fuzz-input"
                        placeholder="Título"
                      />
                      <input
                        name="type"
                        defaultValue={c.type}
                        className="fuzz-input"
                        placeholder="Tipo"
                      />
                      <input
                        name="signedAt"
                        type="date"
                        defaultValue={c.signedAt.slice(0, 10)}
                        className="fuzz-input"
                      />
                      <ContractFileField
                        fileName={editFile?.name ?? ""}
                        existingUrl={c.filePath ? contractFilePath(client.id, c.id) : null}
                        error={editFileError}
                        onChange={(next) => {
                          setEditFile(next);
                          setEditFileError(next ? validateReceiptFile(next) ?? undefined : undefined);
                        }}
                      />
                      <div className="flex flex-wrap gap-2">
                        <button type="submit" className="btn-fuzz text-xs" disabled={editLoading}>
                          {editLoading ? "Guardando..." : "Guardar cambios"}
                        </button>
                        <button
                          type="button"
                          className="btn-fuzz-outline text-xs"
                          onClick={() => setEditingId(null)}
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  )}
                </li>
              ))}
            </ul>
          )}
          <form onSubmit={onAddContract} className="space-y-3 border-t border-[#1c1c1c] pt-4">
            <p className="text-xs text-[#9c9c9c]">Agregar contrato con archivo</p>
            <input name="title" required placeholder="Título" className="fuzz-input" />
            <input name="type" placeholder="Tipo (Consignación, Comodato…)" className="fuzz-input" />
            <input name="signedAt" type="date" className="fuzz-input" />
            <ContractFileField
              fileName={contractFile?.name ?? ""}
              error={contractFileError}
              onChange={(file) => {
                setContractFile(file);
                setContractFileError(file ? validateReceiptFile(file) ?? undefined : undefined);
              }}
            />
            <button type="submit" className="btn-fuzz-outline text-xs">
              + Guardar contrato
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
