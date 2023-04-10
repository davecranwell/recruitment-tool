/*
  Warnings:

  - You are about to drop the column `time` on the `AuditEvent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AuditEvent" DROP COLUMN "time",
ALTER COLUMN "oldValue" DROP NOT NULL,
ALTER COLUMN "newValue" DROP NOT NULL;
