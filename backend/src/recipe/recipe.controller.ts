import { Body, Controller, Get, Param, Patch, Post, Delete, UseGuards, UseInterceptors, UploadedFile, UploadedFiles, Res } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { Recipe } from './entities/recipe.entity';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RecipePaginateDto } from './dto/recipe-paginate.dto';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { JwtPayload } from 'src/auth/dto/jwt-payload.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/auth/decorators/user.decorators';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { RecipeHook } from './recipe.hook';
import { RecipeCompactDto, RecipeCompactWithoutAuthor } from './dto/recipe-compact.dto';
import { Ingredient } from './entities/ingredients.entity';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentHook } from './comment.hook';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@ApiTags('recipe')
@Controller('recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService, private readonly configService: ConfigService) {}

  @ApiOkResponse({ type: Recipe })
  @Get('detail/:id')
  async getCompleteRecipe(@Param('id') id: number) {
    return this.recipeService.getCompleteRecipe(+id);
  }

  @ApiOkResponse({ type: Recipe })
  @Get('/slug/:slug')
  async getCompleteRecipeBySlug(@Param('slug') slug: string) {
    return this.recipeService.getCompleteRecipeBySlug(slug);
  }

  @ApiOkResponse({ type: [RecipeCompactWithoutAuthor] })
  @Get('/user/:id')
  async getUserRecipe(@Param('id') id: number) {
    return this.recipeService.getRecipeByUser(+id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: [RecipeCompactDto] })
  @ApiBearerAuth()
  @Get('favorites')
  async getFavoriteRecipes(@User() user: JwtPayload) {
    return this.recipeService.getFavoriteRecipes(user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('favorites/:id')
  async addFavoriteRecipe(@Param('id') id: number, @User() user: JwtPayload) {
    return this.recipeService.addFavoriteRecipe(+id, user);
  }

  @ApiOkResponse({ type: RecipePaginateDto })
  @Get('/category/:id/:page')
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
  @Patch('update/:id')
  async update(@Param('id') id: number, @Body() updateRecipeDto: CreateRecipeDto): Promise<Recipe> {
    return this.recipeService.update(+id, updateRecipeDto);
  }

  @UseGuards(JwtAuthGuard, AccessGuard)
  @UseAbility(Actions.delete, Recipe, RecipeHook)
  @ApiBearerAuth()
  @ApiOkResponse({ type: Recipe })
  @Delete('/:id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.recipeService.delete(+id);
  }


  @ApiOkResponse({ type: [Ingredient] })
  @Get('/ingredients')
  async getIngredients(): Promise<Ingredient[]> {
    return this.recipeService.findAllIngredients();
  }

  @UseGuards(JwtAuthGuard)
  @Post('/create/upload')
  @UseInterceptors(FilesInterceptor('files', 5, {
    storage: diskStorage({
      destination: process.env.MULTER_RECIPE_PICTURES_DEST,
      filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
      }
    })
  }))
  async uploadFiles(@UploadedFiles() files) {
    console.log(files);
    return files.map(file => ({ filename: file.filename, path: `${this.configService.get<string>('APP_URL')}/recipe/assets/${file.filename}`}));
  }

  @Get('assets/:path')
  async serveAssets(@Param('path') path: string, @Res() response: Response) {
    return response.sendFile(path, { root: this.configService.get<string>('MULTER_RECIPE_PICTURES_DEST') });
  }

  @UseGuards(JwtAuthGuard, AccessGuard)
  @UseAbility(Actions.create, Comment, CommentHook)
  @Post('/comment/:id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: Comment })
  @ApiBody({ type: CreateCommentDto })
  async addComment(@Param('id') id: number, @Body() comment: CreateCommentDto, @User() user: JwtPayload) {
    return this.recipeService.addComment(+id, comment, user);
  }

  @UseGuards(JwtAuthGuard, AccessGuard)
  @UseAbility(Actions.delete, Comment, CommentHook)
  @Delete('/comment/:id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: Comment })
  async deleteComment(@Param('id') id: number, @User() user: JwtPayload) {
    return this.recipeService.deleteComment(+id);
  }

  @UseGuards(JwtAuthGuard, AccessGuard)
  @UseAbility(Actions.update, Comment, CommentHook)
  @Patch('/comment/:id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: Comment })
  @ApiBody({ type: Comment })
  async updateComment(@Param('id') id: number, @Body() comment: UpdateCommentDto, @User() user: JwtPayload) {
    return this.recipeService.updateComment(+id, comment);
  }
}
