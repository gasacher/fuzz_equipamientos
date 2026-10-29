import { existsSync } from "node:fs";
import path from "path";
import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { importFullExcel } from "@/lib/import-excel";
import { revalidateClientCatalog } from "@/lib/revalidate-catalog";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await requireSession("ADMIN");
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const excelPath =
    process.env.EXCEL_PATH ?? path.resolve(process.cwd(), "../FUZZEQUIPAMIENTOS - ADMIN.xlsx");
  if (!existsSync(excelPath)) {
    return NextResponse.json(
      {
        error:
          "No hay un Excel para importar. Definí EXCEL_PATH con un archivo local (no se versiona en el repositorio).",
      },
      { status: 400 },
    );
  }

  try {
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
