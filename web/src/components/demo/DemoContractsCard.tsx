"use client";

import { useEffect, useState } from "react";
import { ContractFileField } from "@/components/ContractFileField";
import {
  getDemoContracts,
  newDemoContractId,
  saveDemoContracts,
  type DemoContract,
} from "@/lib/demo-contract-storage";
import { formatDemoDate } from "@/lib/demo-features";
import { readFileAsDataUrl, validateReceiptFile } from "@/lib/receipt-file";
import { openContractPdf } from "@/lib/simple-pdf";

type SeedContract = {
  id: string;
  title: string;
  type: string;
  signedAt: string;
};

type Props = {
  clientId: string;
  clientName: string;
  seed: SeedContract[];
};

const EMPTY_FORM = {
  title: "",
  type: "Consignación",
  signedAt: "",
};

export function DemoContractsCard({ clientId, clientName, seed }: Props) {
  const [contracts, setContracts] = useState<DemoContract[]>([]);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setContracts(getDemoContracts(clientId, seed));
    // seed is the initial list from the page; storage wins after the first visit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  function persist(next: DemoContract[]) {
    setContracts(next);
    saveDemoContracts(clientId, next);
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  }

  function startEdit(contract: DemoContract) {
    setEditingId(contract.id);
    setForm({
      title: contract.title,
      type: contract.type,
      signedAt: contract.signedAt.slice(0, 10),
    });
    setFile(null);
    setFileError(undefined);
  }

  function startNew() {
    setEditingId("new");
    setForm({ ...EMPTY_FORM, signedAt: new Date().toISOString().slice(0, 10) });
    setFile(null);
    setFileError(undefined);
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    const title = form.title.trim();
    if (!title) return;
    if (file) {
      const err = validateReceiptFile(file);
      if (err) {
        setFileError(err);
        return;
      }
    }

    const fileUrl = file ? await readFileAsDataUrl(file) : undefined;
    const fileName = file?.name ?? undefined;

    if (editingId === "new") {
      persist([
        {
          id: newDemoContractId(),
          title,
          type: form.type.trim() || "Consignación",
          signedAt: form.signedAt || new Date().toISOString().slice(0, 10),
          fileName: fileName ?? null,
          fileUrl: fileUrl ?? null,
        },
        ...contracts,
      ]);
    } else if (editingId) {
      persist(
        contracts.map((item) =>
          item.id === editingId
            ? {
                ...item,
                title,
                type: form.type.trim() || item.type,
                signedAt: form.signedAt || item.signedAt,
                fileName: fileName ?? item.fileName,
                fileUrl: fileUrl ?? item.fileUrl,
              }
            : item,
        ),
      );
    }
    setEditingId(null);
    setFile(null);
  }

  function onDelete(id: string) {
    persist(contracts.filter((item) => item.id !== id));
    if (editingId === id) setEditingId(null);
  }

  return (
    <div className="fuzz-card space-y-4 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#9c9c9c]">Contratos</h2>
          <p className="mt-1 text-xs text-[#9c9c9c]">
            Abrí el PDF, editá los datos o adjuntá un archivo nuevo.
            {saved ? <span className="ml-2 text-[#6fcf97]">Guardado ✓</span> : null}
          </p>
        </div>
        <button type="button" className="btn-fuzz-outline text-xs" onClick={startNew}>
          + Nuevo contrato
        </button>
      </div>

      {contracts.length === 0 && editingId !== "new" ? (
        <p className="text-sm text-[#9c9c9c]">Sin contratos cargados.</p>
      ) : (
        <ul className="space-y-3">
          {contracts.map((contract) => (
            <li
              key={contract.id}
              className="space-y-3 rounded-lg border border-[#1c1c1c] bg-[#0f0f0f] p-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-white">{contract.title}</p>
                  <p className="text-xs text-[#9c9c9c]">
                    {contract.type} · {formatDemoDate(`${contract.signedAt}T12:00:00`)}
                  </p>
                  {contract.fileName && (
                    <p className="mt-1 text-xs text-[#6fcf97]">Archivo: {contract.fileName}</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn-fuzz text-xs"
                    onClick={() =>
                      openContractPdf({
                        fileUrl: contract.fileUrl,
                        title: contract.title,
                        type: contract.type,
                        signedAt: contract.signedAt,
                        clientName,
                      })
                    }
                  >
                    Ver PDF
                  </button>
                  <button
                    type="button"
                    className="btn-fuzz-outline text-xs"
                    onClick={() => startEdit(contract)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="btn-fuzz-outline text-xs"
                    onClick={() => onDelete(contract.id)}
                  >
                    Quitar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editingId && (
        <form onSubmit={onSave} className="space-y-3 border-t border-[#1c1c1c] pt-4">
          <p className="text-sm font-medium text-white">
            {editingId === "new" ? "Nuevo contrato" : "Editar contrato"}
          </p>
          <input
            className="fuzz-input"
            required
            placeholder="Título"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
          <input
            className="fuzz-input"
            placeholder="Tipo (Consignación, Comodato…)"
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
          />
          <input
            className="fuzz-input"
            type="date"
            value={form.signedAt}
            onChange={(e) => setForm((f) => ({ ...f, signedAt: e.target.value }))}
          />
          <ContractFileField
            fileName={file?.name ?? ""}
            error={fileError}
            onChange={(next) => {
              setFile(next);
              setFileError(next ? validateReceiptFile(next) ?? undefined : undefined);
            }}
          />
          <div className="flex flex-wrap gap-2">
            <button type="submit" className="btn-fuzz text-sm">
              Guardar contrato
            </button>
            <button
              type="button"
              className="btn-fuzz-outline text-sm"
              onClick={() => setEditingId(null)}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
