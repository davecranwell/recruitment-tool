/*
  Warnings:

  - The primary key for the `Approval` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Approval` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Approval" DROP CONSTRAINT "Approval_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Approval_pkey" PRIMARY KEY ("userId", "positionId");
