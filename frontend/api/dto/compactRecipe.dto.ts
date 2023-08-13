import { RecipeDto } from "./recipe.dto";
export interface CompactRecipeDto extends Omit<RecipeDto, "ingredients" | "steps" | "categories"> {};