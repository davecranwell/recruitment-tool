-- AlterTable
ALTER TABLE "Stage" ADD COLUMN     "isDisqualifiedStage" BOOLEAN;

-- CreateIndex
CREATE INDEX "AuditEvent_relatedEntityId_idx" ON "AuditEvent"("relatedEntityId");
