import { recipeStep } from "@prisma/client";
import {ApiProperty} from "@nestjs/swagger";

export class RecipeStep implements recipeStep {
    @ApiProperty()
    id: number;
    @ApiProperty()
    recipeId: number;
    @ApiProperty()
    step: number;
    @ApiProperty()
    description: string;
    @ApiProperty()
    time: number;

}