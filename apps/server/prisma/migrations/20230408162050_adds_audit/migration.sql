-- CreateEnum
CREATE TYPE "AuditEventType" AS ENUM ('CREATED', 'UPDATED', 'DELETED', 'STAGE_CHANGED', 'DISQUALIFIED', 'APPROVED');

-- CreateEnum
CREATE TYPE "AuditEventEntity" AS ENUM ('POSITION', 'APPLICANTPROFILEFORPOSITION', 'INTERVIEW');

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" SERIAL NOT NULL,
    "eventType" TEXT NOT NULL,
    "entityType" "AuditEventEntity" NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "oldValue" JSONB NOT NULL,
    "newValue" JSONB NOT NULL,

    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
