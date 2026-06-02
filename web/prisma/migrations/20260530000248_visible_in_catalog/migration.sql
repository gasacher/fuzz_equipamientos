-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Instrument" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "historias" TEXT,
    "categoria" TEXT NOT NULL,
    "subcategoria" TEXT,
    "titulo" TEXT NOT NULL,
    "valorUsd" REAL,
    "valorArg" REAL,
    "contacto" TEXT,
    "fb" BOOLEAN NOT NULL DEFAULT false,
    "ig" TEXT,
    "ml" BOOLEAN NOT NULL DEFAULT false,
    "marca" TEXT,
    "anio" TEXT,
    "origen" TEXT,
    "imageUrl" TEXT,
    "descripcion" TEXT,
    "visibleInCatalog" BOOLEAN NOT NULL DEFAULT true,
    "clientId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Instrument_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Instrument" ("anio", "categoria", "clientId", "contacto", "createdAt", "descripcion", "fb", "historias", "id", "ig", "imageUrl", "marca", "ml", "origen", "subcategoria", "titulo", "updatedAt", "valorArg", "valorUsd") SELECT "anio", "categoria", "clientId", "contacto", "createdAt", "descripcion", "fb", "historias", "id", "ig", "imageUrl", "marca", "ml", "origen", "subcategoria", "titulo", "updatedAt", "valorArg", "valorUsd" FROM "Instrument";
DROP TABLE "Instrument";
ALTER TABLE "new_Instrument" RENAME TO "Instrument";
CREATE INDEX "Instrument_categoria_idx" ON "Instrument"("categoria");
CREATE INDEX "Instrument_visibleInCatalog_idx" ON "Instrument"("visibleInCatalog");
CREATE INDEX "Instrument_clientId_idx" ON "Instrument"("clientId");
CREATE INDEX "Instrument_titulo_idx" ON "Instrument"("titulo");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
