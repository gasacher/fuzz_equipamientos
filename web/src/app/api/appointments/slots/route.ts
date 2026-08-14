import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  SHOWROOM_SLOT_HOURS,
  availableSlotsForDate,
  dayRangeInShowroom,
  hourInShowroom,
  isBookableDate,
} from "@/lib/showroom-schedule";

export async function GET(request: Request) {
  const date = new URL(request.url).searchParams.get("date")?.trim();
  if (!date || !isBookableDate(date)) {
    return NextResponse.json({ slots: [] });
  }

  const { start, end } = dayRangeInShowroom(date);
  const booked = await prisma.showroomAppointment.findMany({
    where: {
      scheduledAt: { gte: start, lte: end },
      status: { not: "cancelled" },
    },
    select: { scheduledAt: true },
  });

  const bookedHours = booked.map((row) => hourInShowroom(row.scheduledAt));
  const available = availableSlotsForDate(date, bookedHours);

  return NextResponse.json({
    date,
    slots: available.map((hour) => ({
      hour,
      label: `${String(hour).padStart(2, "0")}:00`,
    })),
    bookedHours,
    availableHours: available,
    allHours: SHOWROOM_SLOT_HOURS,
  });
}
