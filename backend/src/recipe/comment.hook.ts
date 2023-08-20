import {Injectable} from '@nestjs/common';
import { Request, SubjectBeforeFilterHook } from 'nest-casl';
import { Comment } from './entities/comment.entity';
import { RecipeService } from './recipe.service';

@Injectable()
export class CommentHook implements SubjectBeforeFilterHook<Comment, Request> {
    constructor(private readonly recipeService: RecipeService) {}

    async run({params}: Request): Promise<Comment> {
        return await this.recipeService.findComment(+params.id);
    }
}