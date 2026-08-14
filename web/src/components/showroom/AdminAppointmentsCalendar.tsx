"use client";

import { useMemo, useState } from "react";
import type { AppointmentRow } from "@/components/AppointmentsTable";
import {
  APPOINTMENT_STATUSES,
  SHOWROOM_SLOT_HOURS,
  addDaysToDateStr,
  dateKeyFromScheduledAt,
  formatDateShort,
  hourInShowroom,
  startOfWeekMonday,
  todayInShowroom,
  weekdaysFromMonday,
} from "@/lib/showroom-schedule";

type Props = {
  appointments: AppointmentRow[];
};

const statusBg: Record<string, string> = {
  pending: "bg-[#1a1500] border-[#ffb020]/50 text-[#ffb020]",
  confirmed: "bg-[#0a1a0f] border-[#6fcf97]/50 text-[#6fcf97]",
  cancelled: "bg-[#111] border-[#333] text-[#666] line-through",
};

export function AdminAppointmentsCalendar({ appointments }: Props) {
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeekMonday(todayInShowroom()),
  );

  const weekDays = useMemo(() => weekdaysFromMonday(weekStart), [weekStart]);

  const cellMap = useMemo(() => {
    const map = new Map<string, AppointmentRow>();
    for (const apt of appointments) {
      if (apt.status === "cancelled") continue;
      const date = dateKeyFromScheduledAt(new Date(apt.scheduledAt));
      const hour = hourInShowroom(new Date(apt.scheduledAt));
      map.set(`${date}-${hour}`, apt);
    }
    return map;
  }, [appointments]);

  return (
    <div className="fuzz-card space-y-4 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="fuzz-title text-lg text-white">Calendario semanal</h2>
          <p className="text-xs text-[#9c9c9c]">
            Cada turno solo admite una cita. Los horarios ocupados no se pueden reservar de nuevo.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="btn-fuzz-outline text-xs"
            onClick={() => setWeekStart((w) => addDaysToDateStr(w, -7))}
          >
            ← Semana
          </button>
          <button
            type="button"
            className="btn-fuzz-outline text-xs"
            onClick={() => setWeekStart(startOfWeekMonday(todayInShowroom()))}
          >
            Hoy
          </button>
          <button
            type="button"
            className="btn-fuzz-outline text-xs"
            onClick={() => setWeekStart((w) => addDaysToDateStr(w, 7))}
          >
            Semana →
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-[#1c1c1c] bg-[#0f0f0f] p-2 text-left text-xs text-[#9c9c9c]">
                Horario
              </th>
              {weekDays.map((day) => (
                <th
                  key={day}
                  className="border border-[#1c1c1c] bg-[#0f0f0f] p-2 text-center text-xs capitalize text-[#9c9c9c]"
                >
                  {formatDateShort(day)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SHOWROOM_SLOT_HOURS.map((slotHour) => (
              <tr key={slotHour}>
                <td className="border border-[#1c1c1c] bg-[#0f0f0f] p-2 text-xs text-[#9c9c9c] whitespace-nowrap">
                  {String(slotHour).padStart(2, "0")}:00
                </td>
                {weekDays.map((day) => {
                  const apt = cellMap.get(`${day}-${slotHour}`);
                  return (
                    <td
                      key={`${day}-${slotHour}`}
                      className={`min-h-[52px] border border-[#1c1c1c] p-1 align-top ${
                        apt ? "" : "bg-[#111]"
                      }`}
                    >
                      {apt ? (
                        <div
                          className={`rounded border px-2 py-1.5 text-xs ${statusBg[apt.status] ?? statusBg.pending}`}
                          title={apt.interestNote ?? undefined}
                        >
                          <p className="font-medium">{apt.visitorName}</p>
                          <p className="truncate opacity-80">
                            {APPOINTMENT_STATUSES[
                              apt.status as keyof typeof APPOINTMENT_STATUSES
                            ] ?? apt.status}
                          </p>
                        </div>
                      ) : (
                        <span className="block px-1 py-2 text-[10px] text-[#444]">Libre</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
