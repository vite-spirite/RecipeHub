import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiBody, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Category } from './entities/catergoy.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { CaslAction } from '@prisma/client';

@ApiTags('categories')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService, private readonly casl: CaslAbilityFactory) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({type: CreateCategoryDto})
  @Post()
  async create(@Body() data: CreateCategoryDto, @Req() req: any) {
    const ability = await this.casl.defineAbilitiesFor(req.user);
    console.log(ability.can(CaslAction.MANAGE, 'Category'));

    return await this.categoryService.create(data);
  }

  @Get()
  async findAll(): Promise<Category[]> {
    return await this.categoryService.findAll();
  }
  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  async update(@Body() data: UpdateCategoryDto, @Param('id') id: number, @Req() req: any) {
    const cat = await this.categoryService.findOne(+id);
    const ability = await this.casl.defineAbilitiesFor(req.user);
    
    if(!ability.can(CaslAction.MANAGE, cat) && !ability.can(CaslAction.UPDATE, cat)) {
      throw new Error('You are not allowed to update this category');
    }

    return await this.categoryService.update(+id, data);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req: any) {
    const cat = await this.categoryService.findOne(+id);

    const ability = await this.casl.defineAbilitiesFor(req.user);
    if(!ability.can(CaslAction.MANAGE, cat) && !ability.can(CaslAction.DELETE, cat)) {
      throw new Error('You are not allowed to delete this category');
    }

    return await this.categoryService.remove(+id);
  }
}
