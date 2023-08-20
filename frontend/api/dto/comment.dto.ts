import { PublicUserDto } from "./publicUser.dto";

export interface CommentDto {
    id: number;
    user: PublicUserDto;
    comment: string;
    rating: number;
    createdAt: Date;
}