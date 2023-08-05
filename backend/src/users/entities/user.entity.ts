import { ApiProperty } from "@nestjs/swagger";
import { Prisma, Provider, Roles, user } from "@prisma/client";
import { AuthorizableUser } from "nest-casl";

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
    @ApiProperty({default: Roles.CUSTOMER, enum: Roles})
    roles: Roles = Roles.CUSTOMER;

    @ApiProperty({default: Provider.LOCAL})
    provider: Provider;
    @ApiProperty({nullable: true})
    providerId: string|null;
}