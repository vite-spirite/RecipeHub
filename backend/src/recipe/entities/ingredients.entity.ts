import { ingredient } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class Ingredient implements ingredient {
    @ApiProperty()
    id: number;
    @ApiProperty()
    name: string;
    @ApiProperty()
    unit: string;
    @ApiProperty({nullable: true})
    picture: string|null;
    @ApiProperty({type: 'Date'})
    createdAt: Date;
    @ApiProperty({type: 'Date'})
    updatedAt: Date;
    @ApiProperty({type: 'Date', nullable: true})
    deletedAt: Date|null;
}