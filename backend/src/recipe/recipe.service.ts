import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Recipe } from './entities/recipe.entity';
import { ConfigService } from '@nestjs/config';
import { RecipePaginateDto } from './dto/recipe-paginate.dto';
import { RecipeCompactDto } from './dto/recipe-compact.dto';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { JwtPayload } from 'src/auth/dto/jwt-payload.dto';
import slugify from 'slugify';

@Injectable()
export class RecipeService {
    constructor(private prisma: PrismaService, @Inject(CACHE_MANAGER) private cache: CacheStore, private config: ConfigService) {}

    async create(recipe: CreateRecipeDto, user: JwtPayload): Promise<Recipe> {
        const _recipe = await this.prisma.recipe.create({
            data: {
                name: recipe.name,
                slug: "temp",
                pictures: recipe.pictures,
                preparationTime: recipe.preparationTime,
                cookingTime: recipe.cookingTime,
                growingTime: recipe.growingTime,
                portions: recipe.portions,
                difficulty: recipe.difficulty,
                authorId: user.id,
                ingredients: {
                    create: recipe.ingredients.map(ingredient => {
                        if(ingredient.ingredientId) {
                            return {
                                quantity: ingredient.quantity,
                                overrideUnit: ingredient.overrideUnit,
                                ingredient: {
                                    connect: {
                                        id: ingredient.ingredientId
                                    }
                                }
                            }
                        } else {
                            return {
                                quantity: ingredient.quantity,
                                overrideUnit: ingredient.overrideUnit,
                                ingredient: {
                                    create: {
                                        name: ingredient.createIngredient.name,
                                        picture: ingredient.createIngredient.picture,
                                        unit: ingredient.createIngredient.unit,
                                    }
                                }
                            }
                        }
                    }),
                },
                steps: {
                    create: recipe.steps.map(step => {
                        return {
                            description: step.description,
                            step: step.step,
                            time: step.time,
                        }
                    }),
                },
                categories: {
                    connect: recipe.categoryIds.map(categoryId => {
                        return { id: categoryId }
                    })
                },
            }
        });

        await this.prisma.recipe.update({data: {slug: slugify(`${_recipe.id}-${_recipe.name}`)}, where: {id: _recipe.id}});
        return await this.getCompleteRecipe(_recipe.id);
    }

    async getCompleteRecipe(id: number): Promise<Recipe> {

        const caching = await this.cache.get<Recipe>(`recipe:${id}`);

        if(caching) {
            return caching;
        }

        const recipe = (await this.prisma.recipe.findUnique({
            where: {id},
            include: {
                ingredients: {
                    include: {
                        ingredient: true
                    }
                },
                steps: true,
                author: {select: {id: true, firstName: true, lastName: true, picture: true, createdAt: true, updatedAt: true}}
            }
        })) as unknown as Recipe;

        await this.cache.set<Recipe>(`recipe:${id}`, recipe, parseInt(this.config.get('REDIS_CACHE_RECIPE_TTL')));
        return recipe;
    }

    async getRecipesByCategory(category: number, page: number): Promise<RecipePaginateDto> {
        const perPage = parseInt(this.config.get('RECIPE_PER_PAGE'));
        const skip = (page - 1) * perPage < 0 ? 0 : (page - 1) * perPage;

        const totalCached = await this.getTotalRecipesCachedByCategory(category);

        const total = totalCached === undefined ? await this.prisma.recipe.count({
            where: {
                categories: {
                    some: {
                        id: category
                    }
                }
            }
        }) : totalCached;

        const lastPage = Math.ceil(total / perPage);

        const recipesCached = await this.getRecipesCachedByCategory(category, page);

        const data = recipesCached === undefined ? await this.prisma.recipe.findMany({
            where: {
                deletedAt: null,
                categories: {
                    some: {
                        id: category
                    }
                }
            },
            include: {
                author: {select: {id: true, firstName: true, lastName: true, picture: true, createdAt: true, updatedAt: true}},
            },
            take: perPage,
            skip,
        }) as unknown as RecipeCompactDto[] : recipesCached;

        if(recipesCached === undefined) await this.setRecipesCachedByCategory(category, page, data);
        if(totalCached === undefined) await this.setTotalRecipesCachedByCategory(category, total);

        return {
            page,
            total,
            perPage,
            lastPage,
            data
        }
    }

    async deleteCategoryCache(categorie: number): Promise<void> {
        return await this.cache.del(`recipe:category:${categorie}:*`);
    }

    private async getTotalRecipesCachedByCategory(category: number): Promise<number|undefined> {
        return await this.cache.get<number>(`recipe:category:${category}:total`);
    }

    private async setTotalRecipesCachedByCategory(category: number, total: number): Promise<void> {
        await this.cache.set<number>(`recipe:category:${category}:total`, total, 1000*60*60*24*7);
    }

    private async getRecipesCachedByCategory(category: number, page: number): Promise<RecipeCompactDto[]|undefined> {
        return await this.cache.get<RecipeCompactDto[]>(`recipe:category:${category}:page:${page}`);
    }

    private async setRecipesCachedByCategory(category: number, page: number, data: RecipeCompactDto[]): Promise<void> {
        await this.cache.set<RecipeCompactDto[]>(`recipe:category:${category}:page:${page}`, data, 1000*60*60*24*7);
    }

    async findById(id: number): Promise<Recipe> {
        const raw = await this.prisma.recipe.findUnique({where: {id}});
        return new Recipe(raw);
    }
}
