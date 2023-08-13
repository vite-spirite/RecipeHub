import { IngredientDto } from "./ingredient.dto";

export interface RecipeIngredientDto {
    id: number;
    ingredient: IngredientDto;
    quantity: number;
    overrideUnit?: string;
}
