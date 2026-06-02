-- CreateTable
CREATE TABLE "Sale" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "historias" TEXT,
    "dia" TEXT,
    "titulo" TEXT NOT NULL,
    "precioVentaUsd" REAL,
    "porcentajeComision" REAL,
    "totalComisionFuzz" REAL,
    "mes" TEXT,
    "comKar" REAL,
    "comLean" REAL,
    "comFuzz" REAL,
    "anio" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Sale_mes_idx" ON "Sale"("mes");

-- CreateIndex
CREATE INDEX "Sale_anio_idx" ON "Sale"("anio");

-- CreateIndex
CREATE INDEX "Sale_titulo_idx" ON "Sale"("titulo");
