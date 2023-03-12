-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "defaultPipelineId" INTEGER;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_defaultPipelineId_fkey" FOREIGN KEY ("defaultPipelineId") REFERENCES "Pipeline"("id") ON DELETE SET NULL ON UPDATE CASCADE;
