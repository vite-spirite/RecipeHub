import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { CaslModule } from 'nest-casl';
import { permissions } from './category.permissions';

@Module({
  imports: [CaslModule.forFeature({permissions})],
  controllers: [CategoryController],
  providers: [CategoryService, PrismaService],
  exports: [CategoryService]
})
export class CategoryModule {}
