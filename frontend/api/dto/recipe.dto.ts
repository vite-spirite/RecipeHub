import { PublicUserDto } from "./publicUser.dto";
import {  RecipeIngredientDto} from './recipeIngredient.dto';
import { CategoryDto } from "./category.dto";
import { StepDto } from "./step.dto";
import {CommentDto} from './comment.dto';

export interface RecipeDto {
    id: number;
    name: string;
    slug: string;
    pictures: string[];
    preparationTime: number;
    cookingTime: number;
    growingTime: number;
    portions: number;
    difficulty: number;
    author: PublicUserDto;
    categories: CategoryDto[];
    ingredients: RecipeIngredientDto[];
    steps: StepDto[];
    comments: CommentDto[];
    rating: number;
    createdAt: Date;
    updatedAt: Date;
}