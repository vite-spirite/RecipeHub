/*
  Warnings:

  - You are about to drop the column `deficulty` on the `recipe` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "recipe" DROP COLUMN "deficulty",
ADD COLUMN     "difficulty" INTEGER NOT NULL DEFAULT 1;
