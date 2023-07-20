import { ApiProperty } from "@nestjs/swagger";
import { Prisma, user } from "@prisma/client";

export class User implements user {
    @ApiProperty()
    id: number;
    @ApiProperty()
    firstName: string;
    @ApiProperty()
    lastName: string;
    @ApiProperty()
    email: string;
    @ApiProperty()
    password: string;
    @ApiProperty({nullable: true})
    picture: Buffer|null;
    @ApiProperty()
    createdAt: Date;
    @ApiProperty()
    updatedAt: Date;
}
