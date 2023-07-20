import { ApiProperty } from "@nestjs/swagger";
import { User } from "../entities/user.entity";

export class PublicUserDto implements Exclude<User, 'password'|'email'> {
    @ApiProperty()
    id: number;
    @ApiProperty()
    firstName: string;
    @ApiProperty()
    lastName: string;
    @ApiProperty()
    picture: Buffer;
    @ApiProperty()
    createdAt: Date;
    @ApiProperty()
    updatedAt: Date;


    password: string;
    email: string;

}