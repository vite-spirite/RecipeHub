import { Body, Controller, Get, Param, Patch, Post, Delete, UseGuards } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { Recipe } from './entities/recipe.entity';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RecipePaginateDto } from './dto/recipe-paginate.dto';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { JwtPayload } from 'src/auth/dto/jwt-payload.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/auth/decorators/user.decorators';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { RecipeHook } from './recipe.hook';

@ApiTags('recipe')
@Controller('recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @ApiOkResponse({ type: Recipe })
  @Get(':id')
  async getCompleteRecipe(@Param('id') id: number) {
    return this.recipeService.getCompleteRecipe(+id);
  }

  @ApiOkResponse({ type: Recipe })
  @Get('slug/:slug')
  async getCompleteRecipeBySlug(@Param('slug') slug: string) {
    return this.recipeService.getCompleteRecipeBySlug(slug);
  }

  @ApiOkResponse({ type: RecipePaginateDto })
  @Get('category/:id/:page')
  async getRecipesByCategory(@Param('id') id: string, @Param('page') page: number): Promise<RecipePaginateDto> { 
    return this.recipeService.getRecipesByCategory(+id, +page);
  }

  @UseGuards(JwtAuthGuard, AccessGuard)
  @UseAbility(Actions.create, Recipe, RecipeHook)
  @ApiBearerAuth()
  @ApiOkResponse({ type: Recipe })
  @Post()
  async create(@Body() createRecipeDto: CreateRecipeDto, @User() user: JwtPayload): Promise<Recipe> {
    return this.recipeService.create(createRecipeDto, user);
  }

  @UseGuards(JwtAuthGuard, AccessGuard)
  @UseAbility(Actions.update, Recipe, RecipeHook)
  @ApiBearerAuth()
  
  @ApiOkResponse({ type: Recipe })
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateRecipeDto: CreateRecipeDto): Promise<Recipe> {
    return this.recipeService.update(+id, updateRecipeDto);
  }

  @UseGuards(JwtAuthGuard, AccessGuard)
  @UseAbility(Actions.delete, Recipe, RecipeHook)
  @ApiBearerAuth()
  @ApiOkResponse({ type: Recipe })
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.recipeService.delete(+id);
  }

}
