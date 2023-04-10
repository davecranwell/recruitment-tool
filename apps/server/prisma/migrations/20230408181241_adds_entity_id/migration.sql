-- AlterTable
ALTER TABLE "AuditEvent" ADD COLUMN     "entityId" INTEGER;

-- CreateIndex
CREATE INDEX "AuditEvent_entityType_entityId_idx" ON "AuditEvent"("entityType", "entityId");
