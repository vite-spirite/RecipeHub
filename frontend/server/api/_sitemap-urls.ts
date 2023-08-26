import { writeFileSync } from "fs";
import { CompactRecipeDto } from "../../api/dto/compactRecipe.dto";
import { PublicUserDto } from "../../api/dto/publicUser.dto";
import { RecipeDto } from "../../api/dto/recipe.dto";
import { RecipePaginateDto } from "../../api/dto/recipePaginate.dto";
import { CategoryDto } from "../../api/dto/category.dto";


export default defineEventHandler(async () => {
    const cresponse = await fetch(`${useRuntimeConfig().public.apiUrlServerSide}/category`);
    const categories = await cresponse.json() as CategoryDto[];
    
    const recipes: CompactRecipeDto[] = [];

    for(const category of categories) {

        const pageResponse = await fetch(`${useRuntimeConfig().public.apiUrlServerSide}/recipe/category/${category.id}/1`);
        const page = await pageResponse.json() as RecipePaginateDto;

        for(let i = 1; i <= page.lastPage; i++) {
            const rresponse = await fetch(`${useRuntimeConfig().public.apiUrlServerSide}/recipe/category/${category.id}/${i}`);
            const _recipes = await rresponse.json();

            recipes.push(..._recipes.data);
        }
    }

    const uresponse = await fetch(`${useRuntimeConfig().public.apiUrlServerSide}/users`);
    const _users = await uresponse.json() as PublicUserDto[]

    return [...recipes.map(recipe => ({loc: `/recipe/${recipe.slug}`, lastmod: recipe.updatedAt, priority: 0.9})), ..._users.map(user => ({loc: `/profile/${user.id}`, lastmod: user.createdAt, priority: 0.9}))];
});