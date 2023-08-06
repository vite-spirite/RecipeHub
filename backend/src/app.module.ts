import { Module } from '@nestjs/common';
import { AuthorizableUser, CaslModule } from 'nest-casl';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { RecipeModule } from './recipe/recipe.module';
import { Roles } from '@prisma/client';
import { User } from './users/entities/user.entity';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    CaslModule.forRoot<Roles, AuthorizableUser<Roles, number>, {user: User}>({
      superuserRole: Roles.ADMIN,
      getUserFromRequest: (req) => ({id: req.user.id, roles: [req.user.roles]}),
    }),
    UsersModule,
    AuthModule,
    CategoryModule,
    RecipeModule,
    AdminModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
