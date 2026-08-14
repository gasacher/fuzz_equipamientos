import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { InstrumentInput } from "@/lib/instruments";
import { recordTraceChanges } from "@/lib/instrument-trace";
import { revalidateClientCatalog } from "@/lib/revalidate-catalog";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const session = await requireSession("ADMIN");
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const body = (await request.json()) as InstrumentInput;

  const before = await prisma.instrument.findUnique({ where: { id } });
  if (!before) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

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
      fb: body.fb ?? false,
      ml: body.ml ?? false,
      imageUrl: body.imageUrl ?? null,
      descripcion: body.descripcion ?? null,
      visibleInCatalog: body.visibleInCatalog ?? true,
      status: body.status ?? before.status,
      location: body.location?.trim() || null,
      buyer: body.buyer?.trim() || null,
      receiptName: body.receiptName?.trim() || null,
    },
  });

  await recordTraceChanges(
    prisma,
    id,
    {
      status: before.status,
      location: before.location,
      buyer: before.buyer,
      receiptName: before.receiptName,
      ig: before.ig,
      fb: before.fb,
      ml: before.ml,
    },
    {
      status: body.status ?? before.status,
      location: body.location,
      buyer: body.buyer,
      receiptName: body.receiptName,
      note: body.traceNote,
      ig: body.ig,
      fb: body.fb,
      ml: body.ml,
    },
  );

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
