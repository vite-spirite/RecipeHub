-- CreateTable
CREATE TABLE "role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "persmissions" (
    "id" SERIAL NOT NULL,
    "subject" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "condition" JSONB,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "persmissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_roleTouser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_roleTouser_AB_unique" ON "_roleTouser"("A", "B");

-- CreateIndex
CREATE INDEX "_roleTouser_B_index" ON "_roleTouser"("B");

-- AddForeignKey
ALTER TABLE "persmissions" ADD CONSTRAINT "persmissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_roleTouser" ADD CONSTRAINT "_roleTouser_A_fkey" FOREIGN KEY ("A") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_roleTouser" ADD CONSTRAINT "_roleTouser_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
