import { PublicUserDto } from 'src/users/dto/public-user.dto';
import { Recipe } from '../entities/recipe.entity';
import { ApiProperty } from '@nestjs/swagger';

export class RecipeCompactDto implements Omit<Recipe, 'ingredients'|'steps'|'categories'> {
    @ApiProperty()
    id: number;
    @ApiProperty()
    name: string;
    @ApiProperty()
    slug: string;
    @ApiProperty()
    pictures: string[];
    @ApiProperty()
    preparationTime: number;
    @ApiProperty()
    cookingTime: number;
    @ApiProperty()
    growingTime: number;
    @ApiProperty()
    difficulty: number;
    @ApiProperty()
    portions: number;
    @ApiProperty()
    authorId: number;
    @ApiProperty()
    createdAt: Date;
    @ApiProperty()
    updatedAt: Date;
    @ApiProperty()
    deletedAt: Date;
    @ApiProperty({type: PublicUserDto})
    author: PublicUserDto;

}