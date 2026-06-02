import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";
import { toProductData } from "../src/lib/catalog";
import { catalogWhere } from "../src/lib/catalog-visibility";
import { aggregateSalesByMonth } from "../src/lib/sales-stats";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const [allInstruments, catalogInstruments, sales] = await Promise.all([
    prisma.instrument.findMany({
      orderBy: [{ categoria: "asc" }, { titulo: "asc" }],
    }),
    prisma.instrument.findMany({
      where: catalogWhere,
      orderBy: [{ categoria: "asc" }, { titulo: "asc" }],
    }),
    prisma.sale.findMany({
      orderBy: [{ anio: "desc" }, { mes: "asc" }, { titulo: "asc" }],
    }),
  ]);

  const salesRows = sales.map((s) => ({
    mes: s.mes,
    precioVentaUsd: s.precioVentaUsd,
    totalComisionFuzz: s.totalComisionFuzz,
  }));

  const salesAgg = sales.reduce(
    (acc, s) => {
      acc.precioVentaUsd += s.precioVentaUsd ?? 0;
      acc.totalComisionFuzz += s.totalComisionFuzz ?? 0;
      return acc;
    },
    { precioVentaUsd: 0, totalComisionFuzz: 0 },
  );

  const instruments = allInstruments.map((i) => ({
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
    visibleInCatalog: i.visibleInCatalog,
  }));

  const payload = {
    exportedAt: new Date().toISOString(),
    stockTotal: allInstruments.length,
    stockPublished: catalogInstruments.length,
    hiddenCount: allInstruments.length - catalogInstruments.length,
    salesCount: sales.length,
    salesTotalUsd: salesAgg.precioVentaUsd,
    salesCommission: salesAgg.totalComisionFuzz,
    salesByMonth: aggregateSalesByMonth(salesRows),
    catalogItems: catalogInstruments.map((i) => toProductData(i)),
    instruments,
    sales: sales.map((s) => ({
      id: s.id,
      historias: s.historias,
      dia: s.dia,
      titulo: s.titulo,
      precioVentaUsd: s.precioVentaUsd,
      porcentajeComision: s.porcentajeComision,
      totalComisionFuzz: s.totalComisionFuzz,
      mes: s.mes,
      comKar: s.comKar,
      comLean: s.comLean,
      comFuzz: s.comFuzz,
      anio: s.anio,
    })),
  };

  const outPath = path.join(__dirname, "../src/data/admin-demo.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2));

  console.log(`Demo admin exportado → ${outPath}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
