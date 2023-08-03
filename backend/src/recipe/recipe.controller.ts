import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { Recipe } from './entities/recipe.entity';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RecipePaginateDto } from './dto/recipe-paginate.dto';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { JwtPayload } from 'src/auth/dto/jwt-payload.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/auth/decorators/user.decorators';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';

@ApiTags('recipe')
@Controller('recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService, private readonly caslAbility: CaslAbilityFactory) {}

  @ApiOkResponse({ type: Recipe })
  @Get(':id')
  async getCompleteRecipe(@Param('id') id: number) {
    return this.recipeService.getCompleteRecipe(+id);
  }

  @ApiOkResponse({ type: RecipePaginateDto })
  @Get('category/:id/:page')
  async getRecipesByCategory(@Param('id') id: string, @Param('page') page: number): Promise<RecipePaginateDto> { 
    return this.recipeService.getRecipesByCategory(+id, +page);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: Recipe })
  @Post()
  async create(@Body() createRecipeDto: CreateRecipeDto, @User() user: JwtPayload): Promise<Recipe> {
    return this.recipeService.create(createRecipeDto, user);
  }
}
