/*
  Warnings:

  - You are about to drop the column `questionSetId` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `InterviewAttendee` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `InterviewAttendee` table. All the data in the column will be lost.
  - You are about to drop the `InterviewQuestion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InterviewQuestionSet` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[applicantProfileId,stageId,positionId]` on the table `Interview` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Interview" DROP CONSTRAINT "Interview_questionSetId_fkey";

-- DropForeignKey
ALTER TABLE "InterviewQuestion" DROP CONSTRAINT "InterviewQuestion_questionSetId_fkey";

-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "questionSetId",
ADD COLUMN     "questionsId" INTEGER;

-- AlterTable
ALTER TABLE "InterviewAttendee" DROP COLUMN "notes",
DROP COLUMN "score";

-- DropTable
DROP TABLE "InterviewQuestion";

-- DropTable
DROP TABLE "InterviewQuestionSet";

-- CreateTable
CREATE TABLE "Assessment" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "userId" INTEGER NOT NULL,
    "score" INTEGER,
    "applicantProfileId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "positionId" INTEGER NOT NULL,
    "interviewId" INTEGER,
    "notes" TEXT,
    "scoringSystemId" INTEGER NOT NULL,

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Questions" (
    "id" SERIAL NOT NULL,
    "questions" JSONB NOT NULL,
    "isCurrent" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "previousId" INTEGER,
    "name" TEXT NOT NULL,

    CONSTRAINT "Questions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Assessment_applicantProfileId_interviewId_idx" ON "Assessment"("applicantProfileId", "interviewId");

-- CreateIndex
CREATE INDEX "Assessment_applicantProfileId_positionId_idx" ON "Assessment"("applicantProfileId", "positionId");

-- CreateIndex
CREATE UNIQUE INDEX "Interview_applicantProfileId_stageId_positionId_key" ON "Interview"("applicantProfileId", "stageId", "positionId");

-- CreateIndex
CREATE INDEX "Invitation_organisationId_idx" ON "Invitation"("organisationId");

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_questionsId_fkey" FOREIGN KEY ("questionsId") REFERENCES "Questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_applicantProfileId_fkey" FOREIGN KEY ("applicantProfileId") REFERENCES "ApplicantProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_scoringSystemId_fkey" FOREIGN KEY ("scoringSystemId") REFERENCES "ScoringSystem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Questions" ADD CONSTRAINT "Questions_previousId_fkey" FOREIGN KEY ("previousId") REFERENCES "Questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
