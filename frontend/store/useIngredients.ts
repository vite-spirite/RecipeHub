import { IngredientDto } from "api/dto/ingredient.dto";
import { useApi } from "./useApi";

export const useIngredients = defineStore('ingredients', () => {
    const ingredients: Ref<IngredientDto[]> = ref([]);

    const fetchIngredients = async () => {
        if(ingredients.value.length > 0) return ingredients.value;

        const data = await useApi().fetchAsync<IngredientDto[]>('/recipe/ingredients', 'GET');

        if(data instanceof Error) throw new Error('No ingredients found');

        ingredients.value = data;
    }

    return {ingredients, fetchIngredients}
})