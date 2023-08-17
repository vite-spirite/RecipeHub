import { ApiProperty, OmitType } from "@nestjs/swagger";
import { User } from "../entities/user.entity";
import { Provider, Roles } from "@prisma/client";

export class PublicUserDto extends OmitType(User, ['password', 'providerId', 'provider', 'roles'] as const) {
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
}