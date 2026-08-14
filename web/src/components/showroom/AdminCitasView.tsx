"use client";

import { useState } from "react";
import {
  AppointmentsTable,
  type AppointmentRow,
} from "@/components/AppointmentsTable";
import { AdminAppointmentsCalendar } from "@/components/showroom/AdminAppointmentsCalendar";

type Props = {
  appointments: AppointmentRow[];
  demo?: boolean;
};

export function AdminCitasView({ appointments: initial, demo }: Props) {
  const [appointments, setAppointments] = useState(initial);

  return (
    <div className="space-y-8">
      <AdminAppointmentsCalendar appointments={appointments} />
      <AppointmentsTable appointments={appointments} onUpdated={setAppointments} demo={demo} />
    </div>
  );
}
