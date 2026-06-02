import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { InstrumentInput } from "@/lib/instruments";
import { revalidateClientCatalog } from "@/lib/revalidate-catalog";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const session = await requireSession("ADMIN");
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const body = (await request.json()) as InstrumentInput;

  const item = await prisma.instrument.update({
    where: { id },
    data: {
      categoria: body.categoria,
      subcategoria: body.subcategoria,
      titulo: body.titulo,
      valorUsd: body.valorUsd,
      valorArg: body.valorArg,
      contacto: body.contacto,
      marca: body.marca,
      anio: body.anio,
      origen: body.origen,
      ig: body.ig,
      imageUrl: body.imageUrl ?? null,
      descripcion: body.descripcion ?? null,
      visibleInCatalog: body.visibleInCatalog ?? true,
    },
  });
  revalidateClientCatalog(id);
  return NextResponse.json(item);
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await requireSession("ADMIN");
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  await prisma.instrument.delete({ where: { id } });
  revalidateClientCatalog(id);
  return NextResponse.json({ ok: true });
}
