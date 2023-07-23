import { ApiProperty } from "@nestjs/swagger";
import { Prisma, Provider, user } from "@prisma/client";

export class User implements user {
    @ApiProperty()
    id: number;
    @ApiProperty()
    firstName: string;
    @ApiProperty()
    lastName: string;
    @ApiProperty()
    email: string;
    @ApiProperty({nullable: true})
    password: string|null;
    @ApiProperty({nullable: true})
    picture: string|null;
    @ApiProperty()
    createdAt: Date;
    @ApiProperty()
    updatedAt: Date;

    @ApiProperty({default: Provider.LOCAL})
    provider: Provider;
    @ApiProperty({nullable: true})
    providerId: string|null;
}
