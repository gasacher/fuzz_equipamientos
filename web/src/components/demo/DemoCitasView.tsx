"use client";

import { AdminCitasView } from "@/components/showroom/AdminCitasView";
import { getDemoAppointments } from "@/lib/demo-appointments";
import { useMemo } from "react";

export function DemoCitasView() {
  const appointments = useMemo(() => getDemoAppointments(), []);
  const pending = appointments.filter((a) => a.status === "pending").length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="fuzz-title text-2xl text-white md:text-3xl">Citas showroom</h1>
        <p className="mt-2 max-w-xl text-sm text-[#9c9c9c]">
          Visitas agendadas desde el catálogo web. Horario: lun–vie, 11 a 19 h.
          {pending > 0 && (
            <span className="ml-2 rounded-full border border-[#ffb020]/40 bg-[#1a1500] px-2 py-0.5 text-xs text-[#ffb020]">
              {pending} pendiente{pending === 1 ? "" : "s"}
            </span>
          )}
        </p>
      </header>
      <AdminCitasView appointments={appointments} demo />
    </div>
  );
}
