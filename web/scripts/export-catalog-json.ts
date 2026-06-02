import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";
import { toProductData } from "../src/lib/catalog";
import { catalogWhere } from "../src/lib/catalog-visibility";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const items = await prisma.instrument.findMany({
    where: catalogWhere,
    orderBy: [{ categoria: "asc" }, { titulo: "asc" }],
  });

  const outPath = path.join(__dirname, "../src/data/catalog.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(
    outPath,
    JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        items: items.map((i) => toProductData(i)),
      },
      null,
      2,
    ),
  );

  console.log(`Exportados ${items.length} ítems → ${outPath}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
