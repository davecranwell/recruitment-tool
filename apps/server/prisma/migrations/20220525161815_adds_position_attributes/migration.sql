-- CreateEnum
CREATE TYPE "PositionEmploymentType" AS ENUM ('FULL', 'PART', 'CONTRACT');

-- AlterTable
ALTER TABLE "ApplicantProfile" ALTER COLUMN "askingSalary" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Position" ADD COLUMN     "employment" "PositionEmploymentType",
ADD COLUMN     "location" TEXT,
ADD COLUMN     "salaryRange" TEXT;
