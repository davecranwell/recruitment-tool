-- AlterEnum
ALTER TYPE "ProjectRoleType" ADD VALUE 'FINANCIAL_MANAGER';

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "approvalsNeeded" INTEGER;

-- CreateTable
CREATE TABLE "Approval" (
    "id" SERIAL NOT NULL,
    "positionId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Approval_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Approval" ADD CONSTRAINT "Approval_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Approval" ADD CONSTRAINT "Approval_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
