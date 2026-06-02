import "dotenv/config";
import path from "path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";
import { importFullExcel } from "../src/lib/import-excel";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const excelPath =
    process.env.EXCEL_PATH ??
    path.resolve(__dirname, "../../FUZZEQUIPAMIENTOS - ADMIN.xlsx");

  await prisma.user.deleteMany();
  await prisma.client.deleteMany();

  const { stock, ventas } = await importFullExcel(prisma, excelPath);

  const adminHash = await bcrypt.hash("admin123", 10);
  await prisma.user.create({
    data: {
      email: "admin@fuzz.com",
      name: "Administrador FUZZ",
      passwordHash: adminHash,
      role: "ADMIN",
    },
  });

  console.log(`Stock: ${stock.imported} instrumentos (${stock.clients} contactos).`);
  console.log(`Ventas: ${ventas.imported} registros.`);
  console.log("Admin: admin@fuzz.com / admin123");
  console.log("Catálogo público: http://localhost:3000/");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
