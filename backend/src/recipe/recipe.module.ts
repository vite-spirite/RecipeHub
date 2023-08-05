import { Module } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { CaslModule } from 'nest-casl';
import { permissions } from './recipe.permissions';

@Module({
  imports: [
    ConfigModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
          store: await redisStore({
              socket: {
                  host: config.get('REDIS_HOST'),
                  port: parseInt(config.get('REDIS_PORT')),
              },
              database: parseInt(config.get('REDIS_CACHE_RECIPE_DB')),
              password: config.get('REDIS_PASSWORD'),
            }),
      }),
    }),
    CaslModule.forFeature({permissions}),
  ],
  controllers: [RecipeController],
  providers: [RecipeService, PrismaService],
  exports: [RecipeService],
})
export class RecipeModule {}
