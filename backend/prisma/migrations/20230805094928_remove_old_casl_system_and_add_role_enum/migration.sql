/*
  Warnings:

  - You are about to drop the `_roleTouser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('ADMIN', 'CUSTOMER');

-- DropForeignKey
ALTER TABLE "_roleTouser" DROP CONSTRAINT "_roleTouser_A_fkey";

-- DropForeignKey
ALTER TABLE "_roleTouser" DROP CONSTRAINT "_roleTouser_B_fkey";

-- DropForeignKey
ALTER TABLE "permission" DROP CONSTRAINT "permission_roleId_fkey";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "roles" "Roles" NOT NULL DEFAULT 'CUSTOMER';

-- DropTable
DROP TABLE "_roleTouser";

-- DropTable
DROP TABLE "permission";

-- DropTable
DROP TABLE "role";

-- DropEnum
DROP TYPE "CaslAction";

-- DropEnum
DROP TYPE "CaslSubject";
