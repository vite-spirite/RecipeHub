import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import {redisStore} from 'cache-manager-redis-yet'
import type { RedisClientOptions } from 'redis';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),

    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useFactory: async (config: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: config.get('REDIS_HOST'),
            port: parseInt(config.get('REDIS_PORT')),
          },
          database: parseInt(config.get('REDIS_REFRESH_TOKEN_DB')),
          password: config.get('REDIS_PASSWORD'),
          ttl: -1,
        }),
      }),
    }),
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
