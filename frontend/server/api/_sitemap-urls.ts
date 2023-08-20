import { CategoryDto } from "../../api/dto/category.dto";
import { CompactRecipeDto } from "../../api/dto/compactRecipe.dto";
import { PublicUserDto } from "../../api/dto/publicUser.dto";

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

    const uresponse = await fetch("http://localhost:3000/users");
    const _users = await uresponse.json() as PublicUserDto[];

    return [...recipes.map(recipe => ({loc: `/recipe/${recipe.slug}`, lastmod: recipe.updatedAt, priority: 0.9})), ..._users.map(user => ({loc: `/profile/${user.id}`, lastmod: user.createdAt, priority: 0.9}))];
})