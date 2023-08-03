-- CreateTable
CREATE TABLE "_categoryTorecipe" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_categoryTorecipe_AB_unique" ON "_categoryTorecipe"("A", "B");

-- CreateIndex
CREATE INDEX "_categoryTorecipe_B_index" ON "_categoryTorecipe"("B");

-- AddForeignKey
ALTER TABLE "_categoryTorecipe" ADD CONSTRAINT "_categoryTorecipe_A_fkey" FOREIGN KEY ("A") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_categoryTorecipe" ADD CONSTRAINT "_categoryTorecipe_B_fkey" FOREIGN KEY ("B") REFERENCES "recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
