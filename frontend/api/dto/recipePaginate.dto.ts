import { CompactRecipeDto } from "./compactRecipe.dto";

export interface RecipePaginateDto {
    page: number;
    total: number;
    perPage: number;
    lastPage: number;
    data: CompactRecipeDto[];
}