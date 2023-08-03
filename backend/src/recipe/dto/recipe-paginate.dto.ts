import {ApiProperty} from "@nestjs/swagger";
import { RecipeCompactDto } from "./recipe-compact.dto";

export class RecipePaginateDto {
    @ApiProperty()
    page: number;
    @ApiProperty()
    total: number;
    @ApiProperty()
    perPage: number;
    @ApiProperty()
    lastPage: number;
    @ApiProperty({type: RecipeCompactDto, isArray: true})
    data: RecipeCompactDto[];
}