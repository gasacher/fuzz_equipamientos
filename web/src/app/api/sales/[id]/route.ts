import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { SaleInput } from "@/lib/sales";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const session = await requireSession("ADMIN");
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const body = (await request.json()) as SaleInput;

  const item = await prisma.sale.update({
    where: { id },
    data: {
      historias: body.historias ?? null,
      dia: body.dia ?? null,
      titulo: body.titulo,
      precioVentaUsd: body.precioVentaUsd ?? null,
      porcentajeComision: body.porcentajeComision ?? null,
      totalComisionFuzz: body.totalComisionFuzz ?? null,
      mes: body.mes ?? null,
      comKar: body.comKar ?? null,
      comLean: body.comLean ?? null,
      comFuzz: body.comFuzz ?? null,
      anio: body.anio ?? null,
    },
  });
  return NextResponse.json(item);
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await requireSession("ADMIN");
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  await prisma.sale.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
