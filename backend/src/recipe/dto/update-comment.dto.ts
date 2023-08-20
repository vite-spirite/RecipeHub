import { OmitType } from "@nestjs/swagger";
import {Comment} from '../entities/comment.entity';

export class UpdateCommentDto extends OmitType(Comment, ['createdAt', 'user', 'userId', 'recipeId'] as const) {}