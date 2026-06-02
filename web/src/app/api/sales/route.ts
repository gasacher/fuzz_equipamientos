import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toSaleData, type SaleInput } from "@/lib/sales";

export async function GET() {
  const session = await requireSession("ADMIN");
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const items = await prisma.sale.findMany({
    orderBy: [{ anio: "desc" }, { mes: "asc" }, { titulo: "asc" }],
  });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const session = await requireSession("ADMIN");
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = (await request.json()) as SaleInput;
  if (!body.titulo?.trim()) {
    return NextResponse.json({ error: "Título requerido" }, { status: 400 });
  }

  const item = await prisma.sale.create({ data: toSaleData(body) });
  return NextResponse.json(item, { status: 201 });
}
