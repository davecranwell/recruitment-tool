/*
  Warnings:

  - You are about to drop the `StagesInPipeline` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "StagesInPipeline" DROP CONSTRAINT "StagesInPipeline_pipelineId_fkey";

-- DropForeignKey
ALTER TABLE "StagesInPipeline" DROP CONSTRAINT "StagesInPipeline_stageId_fkey";

-- AlterTable
ALTER TABLE "Stage" ADD COLUMN     "order" INTEGER,
ADD COLUMN     "pipelineId" INTEGER;

-- DropTable
DROP TABLE "StagesInPipeline";

-- AddForeignKey
ALTER TABLE "Stage" ADD CONSTRAINT "Stage_pipelineId_fkey" FOREIGN KEY ("pipelineId") REFERENCES "Pipeline"("id") ON DELETE SET NULL ON UPDATE CASCADE;
