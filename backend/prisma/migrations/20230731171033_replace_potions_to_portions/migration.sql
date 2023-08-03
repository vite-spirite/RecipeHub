/*
  Warnings:

  - You are about to drop the column `potions` on the `recipe` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "recipe" DROP COLUMN "potions",
ADD COLUMN     "portions" INTEGER NOT NULL DEFAULT 4;
