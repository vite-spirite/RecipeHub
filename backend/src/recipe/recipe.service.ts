import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Recipe } from './entities/recipe.entity';
import { ConfigService } from '@nestjs/config';
import { RecipePaginateDto } from './dto/recipe-paginate.dto';
import { RecipeCompactDto, RecipeCompactWithoutAuthor } from './dto/recipe-compact.dto';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { JwtPayload } from 'src/auth/dto/jwt-payload.dto';
import slugify from 'slugify';
import { Prisma } from '@prisma/client';
import { Ingredient } from './entities/ingredients.entity';
import { connect } from 'http2';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

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

        recipe.categoryIds.forEach(async categoryId => {
            await this.deleteCategoryCache(categoryId);
        });

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
                author: {select: {id: true, firstName: true, lastName: true, picture: true, createdAt: true, updatedAt: true}},
                comments: {include: {user: {select: {id: true, firstName: true, lastName: true, picture: true, createdAt: true, updatedAt: true}}}, orderBy: {createdAt: 'desc'}},
                categories: true,
            }
        }));

        const rating = recipe.comments.length > 0 ? recipe.comments.reduce((acc, {rating}) => acc + rating, 0)/recipe.comments.length : -1;

        const data : Recipe = {
            ...recipe,
            rating,
        } as unknown as Recipe;

        await this.cache.set<Recipe>(`recipe:${id}`, data, parseInt(this.config.get('REDIS_CACHE_RECIPE_TTL')));
        return data;
    }

    async getCompleteRecipeBySlug(slug: string): Promise<Recipe> {
        const id = await this.prisma.recipe.findFirst({where: {slug}, select: {id: true}});
        const caching = await this.cache.get<Recipe>(`recipe:${id}`);

        const recipe = caching ? caching : await this.getCompleteRecipe(id.id);
        return recipe;
    }

    async getRecipeByUser(id: number): Promise<RecipeCompactWithoutAuthor[]> {
        const recipes = await this.prisma.recipe.findMany({where: {authorId: id, deletedAt: null}, include: {comments: {select: {rating: true}}}});

        return recipes.map<RecipeCompactWithoutAuthor>(recipe => {
            const comments = recipe.comments.map(comment => comment.rating);
            delete recipe.comments;

            const rating = comments.length > 0 ? comments.reduce((acc, comment) => {
                return acc + comment;
            })/comments.length : -1;

            return {
                ...recipe,
                rating
            }
        })

    }

    async getRecipesByCategory(category: number, page: number): Promise<RecipePaginateDto> {
        const perPage = parseInt(this.config.get('RECIPE_PER_PAGE'));
        const skip = (page - 1) * perPage < 0 ? 0 : (page - 1) * perPage;

        const totalCached = await this.getTotalRecipesCachedByCategory(category);
        const dbTotal = await this.prisma.recipe.count({where: {deletedAt: null, categories: {some: {id: category}}}});

        if(totalCached !== undefined && totalCached !== dbTotal) {
            await this.deleteCategoryCache(category, Math.ceil(totalCached / perPage));
        }

        const total = totalCached === undefined ? dbTotal : totalCached;

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

    async deleteCategoryCache(categorie: number, page: number|undefined = undefined): Promise<void> {

        if(page === undefined) {
            page = await this.countTotalPage(categorie);
        }

        for(let i = 1; i <= page; i++) {
            await this.cache.del(`recipe:category:${categorie}:page:${i}`);
        }
        
        return await this.cache.del(`recipe:category:${categorie}:total`);
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

    async delete(id: number, basket: boolean = true): Promise<void> {
        if(basket) {
            await this.prisma.recipe.update({data: {deletedAt: new Date()}, where: {id}});
        } else {
            await this.prisma.recipe.delete({where: {id}});
        }

        await this.cache.del(`recipe:${id}`);
        await this.deleteCategoryCache(id);
        return;
    }

    async update(id: number, recipe: CreateRecipeDto): Promise<Recipe> {
        const _recipe = await this.findById(id);

        const updateData: Prisma.recipeUpdateInput = {
            name: recipe.name,
            pictures: recipe.pictures,
            preparationTime: recipe.preparationTime,
            cookingTime: recipe.cookingTime,
            growingTime: recipe.growingTime,
            portions: recipe.portions,
            difficulty: recipe.difficulty,
            updatedAt: new Date(),
            ingredients: {
                deleteMany: _recipe.ingredients.map(ingredient => {
                    return { id: ingredient.id }
                }),
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
                                    unit: ingredient.createIngredient.unit,
                                    picture: ingredient.createIngredient.picture,
                                }
                            }
                        }
                    }
                }),
            },
            steps: {
                deleteMany: _recipe.steps.map(step => {
                    return { id: step.id }
                }),
                create: recipe.steps.map(step => {
                    return {
                        step: step.step,
                        time: step.time,
                        description: step.description,

                    }
                }),
            },
            categories: {
                disconnect: _recipe.categories.map(category => {
                    return { id: category.id }
                }),
                connect: recipe.categoryIds.map(category => {
                    return { id: category }
                }),
            },
        };

        await this.prisma.recipe.update({data: updateData, where: {id}});
        await this.cache.del(`recipe:${id}`);
        await this.deleteCategoryCache(id);

        return await this.findById(id);
    }

    async countTotalPage(category: number, perPage: number|undefined = undefined): Promise<number> {

        if(perPage === undefined) {
            perPage = parseInt(this.config.get('RECIPE_PER_PAGE'));
        }
        
        const total = await this.prisma.recipe.count({where: {deletedAt: null, categories: {some: {id: category}}}});
        return Math.ceil(total / perPage);
    }

    async findAllIngredients(): Promise<Ingredient[]> {
        return await this.prisma.ingredient.findMany({orderBy: {name: 'asc'}}) as unknown as Ingredient[];
    }

    async getFavoriteRecipes(user: JwtPayload): Promise<RecipeCompactDto[]> {
        const recipes = await this.prisma.user.findFirst({
            where: {id: user.id},
            include: {
                favorites: {
                    include: {
                        recipe: {
                            include: {
                                author: {select: {id: true, firstName: true, lastName: true, picture: true, createdAt: true, updatedAt: true}},
                            }
                        }
                    }
                }
            }
        });

        return recipes.favorites.map(favorite => {
            return favorite.recipe;
        }) as RecipeCompactDto[];
    }

    async addFavoriteRecipe(id: number, user: JwtPayload): Promise<void> {
        const exist = await this.prisma.userFavoriteRecipe.findFirst({where: {userId: user.id, recipeId: id}});

        if(!exist) {
            await this.prisma.userFavoriteRecipe.create({
                data: {
                    userId: user.id,
                    recipeId: id,
                }
            })
        }
        else {
            await this.prisma.userFavoriteRecipe.delete({where: {id: exist.id}});
        }
    }

    async findComment(id: number): Promise<Comment> {
        return await this.prisma.comments.findUnique({where: {id}}) as unknown as Comment;
    }

    async addComment(id: number, comment: CreateCommentDto, user: JwtPayload): Promise<Comment> {
        const _comment = await this.prisma.comments.create({
            data: {
                comment: comment.comment,
                rating: comment.rating,
                recipeId: id,
                userId: user.id,
            }
        });

        await this.cache.del(`recipe:${id}`);

        return _comment as unknown as Comment;
    }

    async updateComment(id: number, comment: UpdateCommentDto): Promise<Comment> {
        const _comment = await this.prisma.comments.update({
            data: {
                comment: comment.comment,
                rating: comment.rating,
            },
            where: {id}
        });

        await this.cache.del(`recipe:${_comment.recipeId}`);
        
        return _comment as unknown as Comment;
    }

    async deleteComment(id: number): Promise<void> {
        const comment = await this.prisma.comments.findUnique({where: {id}});
        await this.prisma.comments.delete({where: {id}});
        await this.cache.del(`recipe:${comment.recipeId}`);
    }
}
