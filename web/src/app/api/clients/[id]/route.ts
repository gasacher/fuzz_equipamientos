import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const session = await requireSession("ADMIN");
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      contracts: { orderBy: { signedAt: "desc" } },
      instruments: { orderBy: { titulo: "asc" } },
      users: { select: { email: true, name: true } },
    },
  });

  if (!client) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  const byContact = await prisma.instrument.findMany({
    where: {
      clientId: null,
      contacto: { equals: client.name },
    },
    orderBy: { titulo: "asc" },
  });

  return NextResponse.json({ ...client, instrumentsByContact: byContact });
}

export async function PATCH(request: Request, { params }: Params) {
  const session = await requireSession("ADMIN");
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const body = (await request.json()) as {
    name?: string;
    email?: string;
    phone?: string;
    notes?: string;
  };

  const before = await prisma.client.findUnique({ where: { id } });
  if (!before) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  const name = body.name?.trim() || before.name;

  const client = await prisma.$transaction(async (tx) => {
    const updated = await tx.client.update({
      where: { id },
      data: {
        name,
        email: body.email?.trim() || null,
        phone: body.phone?.trim() || null,
        notes: body.notes?.trim() || null,
      },
    });

    if (name !== before.name) {
      await tx.instrument.updateMany({
        where: {
          OR: [{ clientId: id }, { contacto: before.name }],
        },
        data: { contacto: name, clientId: id },
      });
    } else {
      await tx.instrument.updateMany({
        where: { clientId: id, contacto: null },
        data: { contacto: name },
      });
    }

    return updated;
  });

  return NextResponse.json(client);
}
