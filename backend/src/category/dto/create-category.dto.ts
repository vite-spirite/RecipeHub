import { ApiProperty } from "@nestjs/swagger";

export class CreateCategoryDto {
    @ApiProperty()
    name: string;
    @ApiProperty({required: false, default: null})
    picture?: string;
}