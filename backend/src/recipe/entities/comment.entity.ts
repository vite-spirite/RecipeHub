import {comments} from '@prisma/client'
import { ApiProperty } from '@nestjs/swagger';
import { PublicUserDto } from 'src/users/dto/public-user.dto';

export class Comment implements comments {
    @ApiProperty()
    id: number;

    @ApiProperty()
    user: PublicUserDto

    @ApiProperty()
    comment: string;

    @ApiProperty()
    rating: number;

    @ApiProperty()
    createdAt: Date;    

    userId: number;
    recipeId: number;
}