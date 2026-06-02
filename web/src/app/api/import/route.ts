import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { importFullExcel } from "@/lib/import-excel";
import { revalidateClientCatalog } from "@/lib/revalidate-catalog";
import { prisma } from "@/lib/prisma";
import path from "path";

export async function POST() {
  const session = await requireSession("ADMIN");
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const excelPath = path.resolve(process.cwd(), "../FUZZEQUIPAMIENTOS - ADMIN.xlsx");
    const result = await importFullExcel(prisma, excelPath);
    revalidateClientCatalog();
    return NextResponse.json({
      ok: true,
      message: `Importado: ${result.stock.imported} ítems de stock, ${result.ventas.imported} ventas.`,
      stock: result.stock,
      ventas: result.ventas,
    });
  } catch {
    return NextResponse.json({ error: "Error al importar Excel" }, { status: 500 });
  }
}
