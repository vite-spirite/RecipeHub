import { IngredientDto } from "./ingredient.dto";

export interface RecipeIngredientDto {
    id: number;
    ingredients: IngredientDto;
    quantity: number;
    overrideUnit?: string;
}
