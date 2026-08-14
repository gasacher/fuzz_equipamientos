"use client";

import { useState } from "react";
import {
  AppointmentsTable,
  type AppointmentRow,
} from "@/components/AppointmentsTable";
import { AdminAppointmentsCalendar } from "@/components/showroom/AdminAppointmentsCalendar";

type Props = {
  appointments: AppointmentRow[];
};

export function AdminCitasView({ appointments: initial }: Props) {
  const [appointments, setAppointments] = useState(initial);

  return (
    <div className="space-y-8">
      <AdminAppointmentsCalendar appointments={appointments} />
      <AppointmentsTable appointments={appointments} onUpdated={setAppointments} />
    </div>
  );
}
