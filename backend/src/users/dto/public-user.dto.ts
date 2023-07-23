import { ApiProperty } from "@nestjs/swagger";
import { User } from "../entities/user.entity";
import { Provider } from "@prisma/client";

export class PublicUserDto implements Exclude<User, 'password'|'email'|'provider'|'providerId'> {
    @ApiProperty()
    id: number;
    @ApiProperty()
    firstName: string;
    @ApiProperty()
    lastName: string;
    @ApiProperty()
    picture: string|null;
    @ApiProperty()
    createdAt: Date;
    @ApiProperty()
    updatedAt: Date;


    password: string;
    email: string;
    provider: Provider;
    providerId: string;
}