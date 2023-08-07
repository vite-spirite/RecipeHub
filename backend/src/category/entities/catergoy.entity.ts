import { category } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class Category implements category {
    @ApiProperty({type: 'integer'})
    id: number;
    @ApiProperty()
    name: string;
    @ApiProperty()
    slug: string;
    @ApiProperty({type: 'string'})
    picture: string;
    @ApiProperty({type: 'integer'})
    createdAt: Date;
    @ApiProperty({type: 'integer'})
    updatedAt: Date;
    @ApiProperty({type: 'integer'})
    deletedAt: Date;
}