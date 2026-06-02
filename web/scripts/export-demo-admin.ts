import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";
import { aggregateSalesByMonth } from "../src/lib/sales-stats";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? `file:${path.join(root, "dev.db")}`,
});
const prisma = new PrismaClient({ adapter });

const [stockTotal, stockPublished, sales, instruments] = await Promise.all([
  prisma.instrument.count(),
  prisma.instrument.count({ where: { visibleInCatalog: true } }),
  prisma.sale.findMany({
    select: {
      id: true,
      historias: true,
      dia: true,
      titulo: true,
      precioVentaUsd: true,
      porcentajeComision: true,
      totalComisionFuzz: true,
      mes: true,
      comKar: true,
      comLean: true,
      comFuzz: true,
      anio: true,
    },
    orderBy: [{ anio: "desc" }, { mes: "asc" }, { titulo: "asc" }],
  }),
  prisma.instrument.findMany({
    orderBy: [{ categoria: "asc" }, { titulo: "asc" }],
    select: {
      id: true,
      categoria: true,
      subcategoria: true,
      titulo: true,
      valorUsd: true,
      valorArg: true,
      contacto: true,
      marca: true,
      anio: true,
      origen: true,
      ig: true,
      visibleInCatalog: true,
    },
  }),
]);

const salesTotalUsd = sales.reduce((s, r) => s + (r.precioVentaUsd ?? 0), 0);
const salesCommission = sales.reduce((s, r) => s + (r.totalComisionFuzz ?? 0), 0);

const payload = {
  exportedAt: new Date().toISOString(),
  stockTotal,
  stockPublished,
  salesCount: sales.length,
  salesTotalUsd,
  salesCommission,
  salesByMonth: aggregateSalesByMonth(sales),
  instruments,
  sales,
};

const outPath = path.join(root, "src/data/demo-admin.json");
await writeFile(outPath, JSON.stringify(payload, null, 2));
console.log(`OK ${outPath} (${instruments.length} stock, ${sales.length} ventas)`);

await prisma.$disconnect();
