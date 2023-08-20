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
        
        //recipes.push(..._recipes.data.value.data);
        for(let page = 1; page <= _recipes.lastPage; page++) {
            const sresponse = await fetch(`${useRuntimeConfig().public.apiUrl}/recipe/category/${category.id}/${page}`);
            const _recipe = await sresponse.json() as {data: RecipeDto[]};
            
            recipes.push(..._recipe.data);

            if(useRuntimeConfig().public.deploymentMode === 'static') {
                for (let r = 0; r < recipes.length; r++) {
                    const recipe = recipes[r];
                    for (let i = 0; i < recipe.pictures.length; i++) {
                        if(!recipe.pictures[i].startsWith(useRuntimeConfig().public.apiUrl)) {
                            continue;
                        }

                        const image = recipe.pictures[i];
                        const img = await fetch(image);
                        const buff = await img.arrayBuffer();


                        writeFileSync(`public/img/recipes/${image.split('/').pop()}`, Buffer.from(buff));
                        recipes[r].pictures[i] = `/img/recipes/${image.split('/').pop()}`;
                    }
                }
            }
        }
    }

    const uresponse = await fetch(`${useRuntimeConfig().public.apiUrl}/users`);
    const _users = await uresponse.json() as PublicUserDto[];

    return [...recipes.map(recipe => ({loc: `/recipe/${recipe.slug}`, lastmod: recipe.updatedAt, priority: 0.9})), ..._users.map(user => ({loc: `/profile/${user.id}`, lastmod: user.createdAt, priority: 0.9}))];
})