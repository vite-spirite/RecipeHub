import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, category } from '@prisma/client';
import { CreateCategoryDto } from './dto/create-category.dto';
import slugify from 'slugify';
import { Category } from './entities/catergoy.entity';

@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService) {}

    async findAll(trash: boolean = false): Promise<Category[]> {
        return await this.prisma.category.findMany({where: {deletedAt: trash ? {not: null} : null}});
    }

    async findOne(id: number) {
        return await this.prisma.category.findUnique({where: {id}});
    }

    async fingBySlug(slug: string) {
        return await this.prisma.category.findUnique({where: {slug}});
    }

    async create(data: CreateCategoryDto): Promise<Category> {
        const lastId = await this.prisma.category.findFirst({
            select: {id: true},
            orderBy: {id: 'desc'}
        });

        let id = lastId?.id ?? 0;

        const slug = slugify(`${id + 1} ${data.name}`, {lower: true});

        return await this.prisma.category.create({data: {...data, slug}});
    }

    async update(id: number, data: Prisma.categoryUpdateInput) {
        return await this.prisma.category.update({where: {id}, data});
    }

    async remove(id: number) {
        return await this.prisma.category.update({where: {id}, data: {deletedAt: new Date()}});
    }
}
