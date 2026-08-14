import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { APPOINTMENT_STATUSES } from "@/lib/showroom-schedule";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const session = await requireSession("ADMIN");
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const body = (await request.json()) as { status?: string };

  if (!body.status || !(body.status in APPOINTMENT_STATUSES)) {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  }

  const existing = await prisma.showroomAppointment.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  const appointment = await prisma.showroomAppointment.update({
    where: { id },
    data: { status: body.status },
  });

  return NextResponse.json(appointment);
}
