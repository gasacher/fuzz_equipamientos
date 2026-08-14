import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toInstrumentData, type InstrumentInput } from "@/lib/instruments";
import { recordInitialTrace } from "@/lib/instrument-trace";
import { revalidateClientCatalog } from "@/lib/revalidate-catalog";

export async function GET() {
  const session = await requireSession("ADMIN");
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const items = await prisma.instrument.findMany({
    orderBy: [{ categoria: "asc" }, { titulo: "asc" }],
  });

  return NextResponse.json(
    items.map((i) => ({
      id: i.id,
      categoria: i.categoria,
      subcategoria: i.subcategoria,
      titulo: i.titulo,
      valorUsd: i.valorUsd,
      valorArg: i.valorArg,
      contacto: i.contacto,
      marca: i.marca,
      anio: i.anio,
      origen: i.origen,
      ig: i.ig,
      imageUrl: i.imageUrl,
      descripcion: i.descripcion,
      visibleInCatalog: i.visibleInCatalog,
      status: i.status,
      location: i.location,
    })),
  );
}

export async function POST(request: Request) {
  const session = await requireSession("ADMIN");
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = (await request.json()) as InstrumentInput;
  if (!body.categoria?.trim() || !body.titulo?.trim()) {
    return NextResponse.json({ error: "Categoría y título son obligatorios" }, { status: 400 });
  }
  if (!body.location?.trim()) {
    return NextResponse.json({ error: "La ubicación es obligatoria" }, { status: 400 });
  }

  const item = await prisma.instrument.create({
    data: toInstrumentData(body),
  });

  await recordInitialTrace(prisma, item.id, {
    status: body.status ?? "ingresado",
    location: body.location,
    buyer: body.buyer,
    receiptName: body.receiptName,
    note: body.traceNote,
    titulo: body.titulo,
    ig: body.ig,
    fb: body.fb,
    ml: body.ml,
  });

  revalidateClientCatalog(item.id);
  return NextResponse.json(item, { status: 201 });
}
