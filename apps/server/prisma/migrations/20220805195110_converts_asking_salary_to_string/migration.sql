-- AlterTable
ALTER TABLE "ApplicantProfile" ALTER COLUMN "askingSalary" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Invitation" ALTER COLUMN "role" DROP NOT NULL;
