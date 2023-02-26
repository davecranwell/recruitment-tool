-- AlterTable
ALTER TABLE "Position" ADD COLUMN     "approved" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "Approval_positionId_idx" ON "Approval"("positionId");

-- CreateIndex
CREATE INDEX "Invitation_sent_idx" ON "Invitation"("sent");
