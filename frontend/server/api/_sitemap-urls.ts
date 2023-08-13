import { CategoryDto } from "../../api/dto/category.dto";
import { CompactRecipeDto } from "../../api/dto/compactRecipe.dto";

export default defineEventHandler(async () => {
    const cresponse = await fetch("http://localhost:3000/category");
    const categories = await cresponse.json();
    
    const recipes: CompactRecipeDto[] = [];
    for(const category of categories) {
        const rresponse = await fetch(`http://localhost:3000/recipe/category/${category.id}/1`);
        const _recipes = await rresponse.json();
        
        //recipes.push(..._recipes.data.value.data);
        for(let page = 1; page <= _recipes.lastPage; page++) {
            const sresponse = await fetch(`http://localhost:3000/recipe/category/${category.id}/${page}`);
            const _recipe = await sresponse.json();
            
            recipes.push(..._recipe.data);
        }
    }

    return recipes.map(recipe => ({loc: `/recipe/${recipe.slug}`, lastmod: recipe.updatedAt, priority: 0.9}));
})