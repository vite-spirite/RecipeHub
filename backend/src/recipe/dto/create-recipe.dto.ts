import {ApiProperty} from "@nestjs/swagger";

import { CreateRecipeIngredientDto } from "./create-recipe-ingredient.dto";
import { CreateRecipeStepDto } from "./create-recipe-step.dto";

export class CreateRecipeDto {
    @ApiProperty()
    name: string;
    @ApiProperty()
    pictures: string[];
    @ApiProperty()
    preparationTime: number;
    @ApiProperty()
    cookingTime: number;
    @ApiProperty()
    growingTime: number;
    @ApiProperty()
    portions: number;
    @ApiProperty()
    difficulty: number;
    @ApiProperty()
    ingredients: CreateRecipeIngredientDto[];
    @ApiProperty()
    steps: CreateRecipeStepDto[];
    @ApiProperty()
    categoryIds: number[];
}