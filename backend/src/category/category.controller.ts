import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiBody, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Category } from './entities/catergoy.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { CategoryHook } from './category.hook';

@ApiTags('categories')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(JwtAuthGuard, AccessGuard)
  @UseAbility(Actions.create, Category, CategoryHook)
  @ApiBearerAuth()
  @ApiBody({type: CreateCategoryDto})
  @Post()
  async create(@Body() data: CreateCategoryDto, @Req() req: any) {
    return await this.categoryService.create(data);
  }

  @Get()
  async findAll(): Promise<Category[]> {
    return await this.categoryService.findAll();
  }
  
  @UseGuards(JwtAuthGuard, AccessGuard)
  @UseAbility(Actions.update, Category, CategoryHook)
  @ApiBearerAuth()
  @Patch(':id')
  async update(@Body() data: UpdateCategoryDto, @Param('id') id: number, @Req() req: any) {
    return await this.categoryService.update(+id, data);
  }

  @UseGuards(JwtAuthGuard, AccessGuard)
  @UseAbility(Actions.delete, Category, CategoryHook)
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req: any) {
    return await this.categoryService.remove(+id);
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return await this.categoryService.fingBySlug(slug);
  }
}
