import { Prisma } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateCategoryDto implements Prisma.categoryUpdateInput {
    @ApiProperty({required: false})
    name?: string;
    @ApiProperty({required: false})
    slug?: string;
    @ApiProperty({required: false})
    picture?: string;
}