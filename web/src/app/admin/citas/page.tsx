import { AdminCitasView } from "@/components/showroom/AdminCitasView";
import type { AppointmentRow } from "@/components/AppointmentsTable";
import { prisma } from "@/lib/prisma";

export default async function AdminCitasPage() {
  const rows = await prisma.showroomAppointment.findMany({
    orderBy: [{ scheduledAt: "asc" }],
  });

  const appointments: AppointmentRow[] = rows.map((row) => ({
    id: row.id,
    visitorName: row.visitorName,
    phone: row.phone,
    email: row.email,
    visitType: row.visitType,
    interestNote: row.interestNote,
    scheduledAt: row.scheduledAt.toISOString(),
    status: row.status,
    createdAt: row.createdAt.toISOString(),
  }));

  const pending = appointments.filter((a) => a.status === "pending").length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="fuzz-title text-3xl">Citas showroom</h1>
        <p className="mt-2 max-w-xl text-sm text-[#9c9c9c]">
          Visitas agendadas desde el catálogo web. Horario de atención: lun–vie, 11 a 19 h.
          {pending > 0 && (
            <span className="ml-2 rounded-full border border-[#ffb020]/40 bg-[#1a1500] px-2 py-0.5 text-xs text-[#ffb020]">
              {pending} pendiente{pending === 1 ? "" : "s"}
            </span>
          )}
        </p>
      </header>

      <AdminCitasView appointments={appointments} />
    </div>
  );
}
