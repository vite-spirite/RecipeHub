/*
  Warnings:

  - Changed the type of `subject` on the `permission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `action` on the `permission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CaslAction" AS ENUM ('CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE');

-- CreateEnum
CREATE TYPE "CaslSubject" AS ENUM ('Category', 'User');

-- AlterTable
ALTER TABLE "permission" DROP COLUMN "subject",
ADD COLUMN     "subject" "CaslSubject" NOT NULL,
DROP COLUMN "action",
ADD COLUMN     "action" "CaslAction" NOT NULL;

-- DropEnum
DROP TYPE "Action";
