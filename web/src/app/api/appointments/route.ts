import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { sendAppointmentEmail } from "@/lib/appointment-email.server";
import {
  buildVisitorWhatsAppUrl,
  type AppointmentNotifyPayload,
} from "@/lib/appointment-message";
import { prisma } from "@/lib/prisma";
import {
  VISIT_TYPES,
  buildScheduledAt,
  isBookableDate,
  isSlotInPast,
  type VisitType,
} from "@/lib/showroom-schedule";

export async function GET() {
  const session = await requireSession("ADMIN");
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const appointments = await prisma.showroomAppointment.findMany({
    orderBy: [{ scheduledAt: "asc" }],
  });

  return NextResponse.json(appointments);
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    visitorName?: string;
    phone?: string;
    email?: string;
    visitType?: string;
    interestNote?: string;
    date?: string;
    hour?: number;
  };

  const visitorName = body.visitorName?.trim();
  const phone = body.phone?.trim();
  const email = body.email?.trim() || null;
  const visitType = body.visitType as VisitType;
  const interestNote = body.interestNote?.trim() || null;
  const date = body.date?.trim();
  const hour = body.hour;

  if (!visitorName || !phone) {
    return NextResponse.json({ error: "Nombre y teléfono son obligatorios" }, { status: 400 });
  }
  if (visitType !== "general" && visitType !== "interest") {
    return NextResponse.json({ error: "Tipo de visita inválido" }, { status: 400 });
  }
  if (visitType === "interest" && !interestNote) {
    return NextResponse.json(
      { error: "Contanos qué producto te interesa" },
      { status: 400 },
    );
  }
  if (!date || !isBookableDate(date)) {
    return NextResponse.json({ error: "Elegí un día hábil válido" }, { status: 400 });
  }
  if (typeof hour !== "number" || hour < 11 || hour > 18) {
    return NextResponse.json({ error: "Horario inválido" }, { status: 400 });
  }
  if (isSlotInPast(date, hour)) {
    return NextResponse.json({ error: "Ese horario ya pasó" }, { status: 400 });
  }

  const scheduledAt = buildScheduledAt(date, hour);

  const conflict = await prisma.showroomAppointment.findFirst({
    where: {
      scheduledAt,
      status: { not: "cancelled" },
    },
  });
  if (conflict) {
    return NextResponse.json({ error: "Ese horario ya está reservado" }, { status: 409 });
  }

  const appointment = await prisma.showroomAppointment.create({
    data: {
      visitorName,
      phone,
      email,
      visitType,
      interestNote,
      scheduledAt,
    },
  });

  const notifyPayload: AppointmentNotifyPayload = {
    visitorName,
    phone,
    email,
    visitType,
    interestNote,
    scheduledAt,
  };

  await sendAppointmentEmail(notifyPayload);

  return NextResponse.json(
    {
      appointment,
      whatsappUrl: buildVisitorWhatsAppUrl(notifyPayload),
    },
    { status: 201 },
  );
}
