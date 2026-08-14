import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireSession } from "@/lib/auth";
import { nextClientNumber } from "@/lib/clients";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await requireSession("ADMIN");
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const clients = await prisma.client.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { instruments: true, users: true, contracts: true } },
      users: { select: { email: true, name: true }, take: 1 },
    },
  });

  return NextResponse.json(clients);
}

export async function POST(request: Request) {
  const session = await requireSession("ADMIN");
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = (await request.json()) as {
    name?: string;
    email?: string;
    phone?: string;
    notes?: string;
    userName?: string;
    password?: string;
  };

  const name = body.name?.trim();
  if (!name) return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });

  const clientNumber = await nextClientNumber();

  const client = await prisma.client.create({
    data: {
      name,
      clientNumber,
      email: body.email?.trim() || null,
      phone: body.phone?.trim() || null,
      notes: body.notes?.trim() || null,
    },
  });

  if (body.userName?.trim() && body.email?.trim() && body.password) {
    const passwordHash = await bcrypt.hash(body.password, 10);
    await prisma.user.create({
      data: {
        email: body.email.trim(),
        name: body.userName.trim(),
        passwordHash,
        role: "CLIENT",
        clientId: client.id,
      },
    });
  }

  return NextResponse.json(client, { status: 201 });
}
