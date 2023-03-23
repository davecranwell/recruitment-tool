-- AlterTable
ALTER TABLE "Organisation" ADD COLUMN     "creatorUserId" INTEGER;

-- AddForeignKey
ALTER TABLE "Organisation" ADD CONSTRAINT "Organisation_creatorUserId_fkey" FOREIGN KEY ("creatorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
