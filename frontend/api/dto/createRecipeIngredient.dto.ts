import { IngredientDto } from "./ingredient.dto";

export interface CreateRecipeIngredientDto {
    ingredientId: number|null;
    overrideUnit: string;
    createIngredient: Omit<IngredientDto, 'id'|'createdAt'|'updatedAt'|'deletedAt'>|null;
    quantity: number;
}