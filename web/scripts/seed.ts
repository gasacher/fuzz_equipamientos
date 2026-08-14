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
  const existingAdmin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (existingAdmin) {
    console.log("Base ya inicializada; no se vuelve a importar el Excel.");
    return;
  }

  const excelPath =
    process.env.EXCEL_PATH ??
    path.resolve(__dirname, "../../FUZZEQUIPAMIENTOS - ADMIN.xlsx");

  const { stock, ventas } = await importFullExcel(prisma, excelPath);

  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";
  if (process.env.NODE_ENV === "production" && !process.env.ADMIN_PASSWORD) {
    console.warn("ADMIN_PASSWORD no está definido; usando la clave demo. Cambiala después del primer acceso.");
  }

  const adminHash = await bcrypt.hash(adminPassword, 10);
  await prisma.user.create({
    data: {
      email: (process.env.ADMIN_EMAIL ?? "admin@fuzz.com").toLowerCase().trim(),
      name: "Administrador FUZZ",
      passwordHash: adminHash,
      role: "ADMIN",
    },
  });

  console.log(`Stock: ${stock.imported} instrumentos (${stock.clients} contactos).`);
  console.log(`Ventas: ${ventas.imported} registros.`);
  console.log(`Admin: ${process.env.ADMIN_EMAIL ?? "admin@fuzz.com"}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
