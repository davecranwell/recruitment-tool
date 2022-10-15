/*
  Warnings:

  - You are about to drop the column `organisationId` on the `Position` table. All the data in the column will be lost.
  - You are about to drop the `PositionUserRole` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `projectId` to the `Position` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProjectRoleType" AS ENUM ('HIRING_MANAGER', 'INTERVIEWER');

-- DropForeignKey
ALTER TABLE "Position" DROP CONSTRAINT "Position_organisationId_fkey";

-- DropForeignKey
ALTER TABLE "PositionUserRole" DROP CONSTRAINT "PositionUserRole_positionId_fkey";

-- DropForeignKey
ALTER TABLE "PositionUserRole" DROP CONSTRAINT "PositionUserRole_userId_fkey";

-- DropIndex
DROP INDEX "Position_organisationId_idx";

-- AlterTable
ALTER TABLE "Position" DROP COLUMN "organisationId",
ADD COLUMN     "projectId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "PositionUserRole";

-- DropEnum
DROP TYPE "PositionRoleType";

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "organisationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectUserRole" (
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" INTEGER NOT NULL,
    "role" "ProjectRoleType" NOT NULL,

    CONSTRAINT "ProjectUserRole_pkey" PRIMARY KEY ("userId","projectId")
);

-- CreateIndex
CREATE INDEX "Project_organisationId_idx" ON "Project"("organisationId");

-- CreateIndex
CREATE INDEX "Position_projectId_idx" ON "Position"("projectId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectUserRole" ADD CONSTRAINT "ProjectUserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectUserRole" ADD CONSTRAINT "ProjectUserRole_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
