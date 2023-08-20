import { CreateRecipeIngredientDto } from "./createRecipeIngredient.dto";
import { CreateRecipeStepDto } from "./createRecipeStep.dto";

export interface CreateRecipeDto {
    name: string,
    pictures: string[],
    preparationTime: number,
    cookingTime: number,
    growingTime: number,
    portions: number,
    difficulty: number,
    ingredients: CreateRecipeIngredientDto[],
    steps: CreateRecipeStepDto[],
    categoryIds: number[]
}