-- CreateTable
CREATE TABLE "userFavoriteRecipe" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "recipeId" INTEGER NOT NULL,

    CONSTRAINT "userFavoriteRecipe_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "userFavoriteRecipe" ADD CONSTRAINT "userFavoriteRecipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userFavoriteRecipe" ADD CONSTRAINT "userFavoriteRecipe_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
