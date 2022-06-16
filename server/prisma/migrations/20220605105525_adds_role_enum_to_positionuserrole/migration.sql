/*
  Warnings:

  - The primary key for the `PositionUserRole` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `roleId` on the `PositionUserRole` table. All the data in the column will be lost.
  - You are about to drop the `PositionRole` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `role` to the `PositionUserRole` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PositionUserRole" DROP CONSTRAINT "PositionUserRole_roleId_fkey";

-- AlterTable
ALTER TABLE "PositionUserRole" DROP CONSTRAINT "PositionUserRole_pkey",
DROP COLUMN "roleId",
ADD COLUMN     "role" "PositionRoleType" NOT NULL,
ADD CONSTRAINT "PositionUserRole_pkey" PRIMARY KEY ("userId", "positionId");

-- DropTable
DROP TABLE "PositionRole";
