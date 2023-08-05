import { recipe } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/users/entities/user.entity";
import { RecipeIngrendient } from "./recipe-ingredient.entity";
import { RecipeStep } from "./recipe-step.entity";
import { PublicUserDto } from "src/users/dto/public-user.dto";
import { Category } from "src/category/entities/catergoy.entity";

export class Recipe implements recipe {

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
    categories: Category[];
    @ApiProperty()
    createdAt: Date;
    @ApiProperty()
    updatedAt: Date;
    @ApiProperty()
    deletedAt: Date;

    @ApiProperty({type: PublicUserDto, nullable: true})
    author: PublicUserDto|null;

    @ApiProperty({type: RecipeIngrendient, isArray: true, nullable: true})
    ingredients: RecipeIngrendient[]|null;

    @ApiProperty({type: RecipeStep, isArray: true, nullable: true})
    steps: RecipeStep[]|null;

    constructor(recipe: recipe) {
        Object.assign(this, recipe);
    }
}