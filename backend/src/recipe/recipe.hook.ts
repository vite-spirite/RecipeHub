import {Injectable} from '@nestjs/common';
import { Request, SubjectBeforeFilterHook } from 'nest-casl';
import { Recipe } from './entities/recipe.entity';
import { RecipeService } from './recipe.service';

@Injectable()
export class RecipeHook implements SubjectBeforeFilterHook<Recipe, Request> {
    constructor(private readonly recipeService: RecipeService) {}

    async run({params}: Request) {
        return await this.recipeService.findById(+params.id);
    }
}