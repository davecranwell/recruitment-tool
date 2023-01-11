-- CreateEnum
CREATE TYPE "ScoringSystemType" AS ENUM ('LINEAR', 'LIKERT');

-- AlterTable
ALTER TABLE "ScoringSystem" ADD COLUMN     "type" "ScoringSystemType";
