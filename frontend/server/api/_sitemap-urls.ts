import { writeFileSync } from "fs";
import { CompactRecipeDto } from "../../api/dto/compactRecipe.dto";
import { PublicUserDto } from "../../api/dto/publicUser.dto";
import { RecipeDto } from "../../api/dto/recipe.dto";


export default defineEventHandler(async () => {
    const cresponse = await fetch(`${useRuntimeConfig().public.apiUrl}/category`);
    const categories = await cresponse.json();
    
    const recipes: CompactRecipeDto[] = [];

    for(const category of categories) {
        const rresponse = await fetch(`${useRuntimeConfig().public.apiUrl}/recipe/category/${category.id}/1`);
        const _recipes = await rresponse.json();
        
        recipes.push(..._recipes.data);
    }

    const uresponse = await fetch(`${useRuntimeConfig().public.apiUrl}/users`);
    const _users = await uresponse.json() as {data: PublicUserDto[]};

    return [...recipes.map(recipe => ({loc: `/recipe/${recipe.slug}`, lastmod: recipe.updatedAt, priority: 0.9})), ..._users.data.map(user => ({loc: `/profile/${user.id}`, lastmod: user.createdAt, priority: 0.9}))];
})