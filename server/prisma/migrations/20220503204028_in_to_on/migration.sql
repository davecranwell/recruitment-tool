/*
  Warnings:

  - You are about to drop the `UsersOnOrganisation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UsersOnOrganisation" DROP CONSTRAINT "UsersOnOrganisation_organisationId_fkey";

-- DropForeignKey
ALTER TABLE "UsersOnOrganisation" DROP CONSTRAINT "UsersOnOrganisation_userId_fkey";

-- DropTable
DROP TABLE "UsersOnOrganisation";

-- CreateTable
CREATE TABLE "UsersInOrganisation" (
    "userId" INTEGER NOT NULL,
    "organisationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsersInOrganisation_pkey" PRIMARY KEY ("userId","organisationId")
);

-- AddForeignKey
ALTER TABLE "UsersInOrganisation" ADD CONSTRAINT "UsersInOrganisation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersInOrganisation" ADD CONSTRAINT "UsersInOrganisation_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
