import { ApiProperty } from "@nestjs/swagger";
import { CreateIngredientDto } from "./create-ingredient.dto";

export class CreateRecipeIngredientDto {
    @ApiProperty({required: false, nullable: true})
    ingredientId: number|null;
    @ApiProperty({required: false, nullable: true})
    overrideUnit: string|null;
    @ApiProperty({required: false, nullable: true})
    createIngredient: CreateIngredientDto|null;
    @ApiProperty()
    quantity: number;
}