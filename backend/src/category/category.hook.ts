import { SubjectBeforeFilterHook, Request } from "nest-casl";
import { Category } from "./entities/catergoy.entity";
import { Injectable } from "@nestjs/common";
import { CategoryService } from "./category.service";


@Injectable()
export class CategoryHook implements SubjectBeforeFilterHook<Category, Request> {
    constructor(private readonly categoryService: CategoryService) {}

    async run({params}: Request) {
        return await this.categoryService.findOne(+params.id);
    }
}