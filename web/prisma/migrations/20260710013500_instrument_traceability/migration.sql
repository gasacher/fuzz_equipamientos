-- AlterTable
ALTER TABLE "Instrument" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'ingresado';
ALTER TABLE "Instrument" ADD COLUMN "location" TEXT;
ALTER TABLE "Instrument" ADD COLUMN "buyer" TEXT;
ALTER TABLE "Instrument" ADD COLUMN "receiptName" TEXT;

-- CreateTable
CREATE TABLE "InstrumentEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "instrumentId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "detail" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InstrumentEvent_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "Instrument" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Instrument_status_idx" ON "Instrument"("status");
CREATE INDEX "InstrumentEvent_instrumentId_idx" ON "InstrumentEvent"("instrumentId");
CREATE INDEX "InstrumentEvent_createdAt_idx" ON "InstrumentEvent"("createdAt");

-- Backfill status from catalog visibility
UPDATE "Instrument" SET "status" = 'publicado' WHERE "visibleInCatalog" = 1 AND "status" = 'ingresado';
UPDATE "Instrument" SET "status" = 'pendiente_foto' WHERE "visibleInCatalog" = 0 AND "status" = 'ingresado';
