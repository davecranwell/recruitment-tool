/*
  Warnings:

  - Added the required column `role` to the `UsersInOrganisation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UsersInOrganisation" ADD COLUMN     "role" "UserRoleType" NOT NULL;
