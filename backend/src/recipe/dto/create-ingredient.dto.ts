import {ApiProperty} from "@nestjs/swagger";

export class CreateIngredientDto {
    @ApiProperty()
    name: string;
    @ApiProperty({nullable: true, required: false})
    picture: string|null;
    @ApiProperty()
    unit: string;
}