/*
  Warnings:

  - You are about to drop the `persmissions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "persmissions" DROP CONSTRAINT "persmissions_roleId_fkey";

-- DropTable
DROP TABLE "persmissions";

-- CreateTable
CREATE TABLE "permission" (
    "id" SERIAL NOT NULL,
    "subject" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "condition" JSONB,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "permission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "permission" ADD CONSTRAINT "permission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
