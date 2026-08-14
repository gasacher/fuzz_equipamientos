-- CreateTable
CREATE TABLE "ShowroomAppointment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "visitorName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "visitType" TEXT NOT NULL,
    "interestNote" TEXT,
    "scheduledAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "ShowroomAppointment_scheduledAt_idx" ON "ShowroomAppointment"("scheduledAt");

-- CreateIndex
CREATE INDEX "ShowroomAppointment_status_idx" ON "ShowroomAppointment"("status");
