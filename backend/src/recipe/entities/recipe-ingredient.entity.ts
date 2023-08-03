import { recipeIngredients } from "@prisma/client";
import {ApiProperty} from "@nestjs/swagger";
import { Ingredient } from "./ingredients.entity";
import { Recipe } from "./recipe.entity";

export class RecipeIngrendient implements recipeIngredients {
    @ApiProperty({type: 'integer'})
    id: number;
    @ApiProperty({type: 'integer'})
    recipeId: number;
    @ApiProperty({type: 'integer'})
    ingredientId: number;
    @ApiProperty({type: 'string'})
    quantity: number;

    @ApiProperty({type: Ingredient, nullable: true})
    ingredients: Ingredient|null;

    @ApiProperty({type: () => Recipe, nullable: true})
    recipe: Recipe|null;

    @ApiProperty({type: 'string', required: false})
    overrideUnit: string|null;
}