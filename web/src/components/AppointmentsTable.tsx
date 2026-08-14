"use client";

import { useMemo, useState } from "react";
import {
  buildAdminContactVisitorUrl,
  type AppointmentNotifyPayload,
} from "@/lib/appointment-message";
import {
  APPOINTMENT_STATUSES,
  VISIT_TYPES,
  formatAppointmentDateTime,
  type VisitType,
} from "@/lib/showroom-schedule";

export type AppointmentRow = {
  id: string;
  visitorName: string;
  phone: string;
  email: string | null;
  visitType: string;
  interestNote: string | null;
  scheduledAt: string;
  status: string;
  createdAt: string;
};

type Props = {
  appointments: AppointmentRow[];
  onUpdated?: (appointments: AppointmentRow[]) => void;
};

const statusColors: Record<string, string> = {
  pending: "border-[#ffb020]/40 bg-[#1a1500] text-[#ffb020]",
  confirmed: "border-[#6fcf97]/40 bg-[#0a1a0f] text-[#6fcf97]",
  cancelled: "border-[#333] bg-[#111] text-[#9c9c9c]",
};

export function AppointmentsTable({ appointments: initial, onUpdated }: Props) {
  const [appointments, setAppointments] = useState(initial);
  const [filter, setFilter] = useState<"" | "pending" | "confirmed" | "cancelled">("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!filter) return appointments;
    return appointments.filter((a) => a.status === filter);
  }, [appointments, filter]);

  async function updateStatus(id: string, status: string) {
    setLoadingId(id);
    const res = await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLoadingId(null);
    if (!res.ok) return;
    const updated = (await res.json()) as AppointmentRow;
    setAppointments((rows) => {
      const next = rows.map((r) => (r.id === id ? { ...r, ...updated } : r));
      onUpdated?.(next);
      return next;
    });
  }

  function whatsappHref(row: AppointmentRow) {
    const payload: AppointmentNotifyPayload = {
      visitorName: row.visitorName,
      phone: row.phone,
      email: row.email,
      visitType: row.visitType as VisitType,
      interestNote: row.interestNote,
      scheduledAt: new Date(row.scheduledAt),
    };
    return buildAdminContactVisitorUrl(payload);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <select
          className="fuzz-input sm:max-w-xs"
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
        >
          <option value="">Todas las citas</option>
          {Object.entries(APPOINTMENT_STATUSES).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <p className="self-center text-sm text-[#9c9c9c]">{filtered.length} citas</p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#1c1c1c]">
        <table className="fuzz-table w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Visitante</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id}>
                <td className="text-[#f2f2f2]">
                  {formatAppointmentDateTime(new Date(row.scheduledAt))}
                </td>
                <td>
                  <p className="font-medium text-white">{row.visitorName}</p>
                  <p className="text-xs text-[#9c9c9c]">{row.phone}</p>
                  {row.email && <p className="text-xs text-[#9c9c9c]">{row.email}</p>}
                </td>
                <td className="max-w-[240px] text-[#9c9c9c]">
                  {VISIT_TYPES[row.visitType as VisitType] ?? row.visitType}
                  {row.interestNote && (
                    <p className="mt-1 text-xs text-[#f2f2f2]">{row.interestNote}</p>
                  )}
                </td>
                <td>
                  <span
                    className={`inline-block rounded border px-2 py-0.5 text-xs ${statusColors[row.status] ?? statusColors.pending}`}
                  >
                    {APPOINTMENT_STATUSES[row.status as keyof typeof APPOINTMENT_STATUSES] ??
                      row.status}
                  </span>
                </td>
                <td>
                  <div className="flex flex-wrap gap-2">
                    {row.status === "pending" && (
                      <button
                        type="button"
                        className="btn-fuzz-outline text-xs"
                        disabled={loadingId === row.id}
                        onClick={() => updateStatus(row.id, "confirmed")}
                      >
                        Confirmar
                      </button>
                    )}
                    {row.status !== "cancelled" && (
                      <button
                        type="button"
                        className="btn-fuzz-outline text-xs"
                        disabled={loadingId === row.id}
                        onClick={() => updateStatus(row.id, "cancelled")}
                      >
                        Cancelar
                      </button>
                    )}
                    <a
                      href={whatsappHref(row)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-[#25d366] hover:underline"
                    >
                      WhatsApp
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="p-6 text-center text-sm text-[#9c9c9c]">No hay citas para mostrar.</p>
        )}
      </div>
    </div>
  );
}
