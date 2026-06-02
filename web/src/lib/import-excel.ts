import * as XLSX from "xlsx";
import type { PrismaClient } from "@/generated/prisma/client";
import { parseBool, parseNumber, parseString, parseHistorias } from "@/lib/excel-parse";
import { parseVentasFromSheet } from "@/lib/sales";

export async function importStockSheet(prisma: PrismaClient, excelPath: string) {
  const wb = XLSX.readFile(excelPath);
  const sheet = wb.Sheets["STOCK"];
  if (!sheet) throw new Error("Hoja STOCK no encontrada");

  await prisma.instrument.deleteMany();

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: null });
  const clientCache = new Map<string, string>();

  async function getClientId(contacto: string | null) {
    if (!contacto) return null;
    const cached = clientCache.get(contacto);
    if (cached) return cached;
    const client = await prisma.client.upsert({
      where: { name: contacto },
      create: { name: contacto },
      update: {},
    });
    clientCache.set(contacto, client.id);
    return client.id;
  }

  let imported = 0;
  for (const row of rows) {
    const titulo = parseString(row["Titulo"]);
    const categoria = parseString(row["Categoria"]);
    if (!titulo || !categoria) continue;

    const contactoRaw = parseString(row["Contacto"] as string);
    const contacto =
      contactoRaw && contactoRaw !== "?" && contactoRaw !== "-" ? contactoRaw : null;

    await prisma.instrument.create({
      data: {
        historias: parseString(row["HISTORIAS"]),
        categoria,
        subcategoria: parseString(row["Sub-cate"]),
        titulo,
        valorUsd: parseNumber(row["Valor USD"]),
        valorArg: parseNumber(row["Valor ARG + COM"]),
        contacto,
        fb: parseBool(row["FB"]),
        ig: parseString(row["IG"]),
        ml: parseBool(row["ML"]),
        marca: parseString(row["Marca"]),
        anio: parseString(row["año"]),
        origen: parseString(row["Origen"]),
        clientId: await getClientId(contacto),
        visibleInCatalog: true,
      },
    });
    imported++;
  }

  return { imported, clients: clientCache.size };
}

export async function importVentasSheet(prisma: PrismaClient, excelPath: string) {
  const wb = XLSX.readFile(excelPath);
  const sheet = wb.Sheets["VENTAS"];
  if (!sheet) throw new Error("Hoja VENTAS no encontrada");

  await prisma.sale.deleteMany();

  // Fila 1 = título "VENTAS"; fila 2 = encabezados (Historias, Día, Título…)
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    range: 1,
    defval: null,
  });
  const parsed = parseVentasFromSheet(rows);

  for (const sale of parsed) {
    await prisma.sale.create({ data: sale });
  }

  return { imported: parsed.length };
}

export async function importFullExcel(prisma: PrismaClient, excelPath: string) {
  const stock = await importStockSheet(prisma, excelPath);
  const ventas = await importVentasSheet(prisma, excelPath);
  return { stock, ventas };
}
