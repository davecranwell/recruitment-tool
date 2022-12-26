/*
  Warnings:

  - A unique constraint covering the columns `[applicantProfileId,userId,positionId,interviewId,type]` on the table `Assessment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "AssessmentType" AS ENUM ('INTERVIEW', 'OTHER');

-- DropIndex
DROP INDEX "Assessment_applicantProfileId_interviewId_idx";

-- DropIndex
DROP INDEX "Assessment_applicantProfileId_positionId_idx";

-- AlterTable
ALTER TABLE "Assessment" ADD COLUMN     "type" "AssessmentType" NOT NULL DEFAULT 'INTERVIEW';

-- CreateIndex
CREATE INDEX "Assessment_applicantProfileId_interviewId_type_idx" ON "Assessment"("applicantProfileId", "interviewId", "type");

-- CreateIndex
CREATE INDEX "Assessment_applicantProfileId_positionId_type_idx" ON "Assessment"("applicantProfileId", "positionId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Assessment_applicantProfileId_userId_positionId_interviewId_key" ON "Assessment"("applicantProfileId", "userId", "positionId", "interviewId", "type");

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
