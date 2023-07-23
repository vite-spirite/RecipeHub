import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.factory/casl-ability.factory';
import { PrismaService } from 'src/prisma/prisma.service';
import { CaslController } from './casl.controller';
import { CaslService } from './casl.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';

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
                    database: parseInt(config.get('REDIS_CACHE_ROLE_DB')),
                    password: config.get('REDIS_PASSWORD'),
                }),
            }),
        }),
    ],
    controllers: [CaslController],
    providers: [CaslService, CaslAbilityFactory, PrismaService],
    exports: [CaslAbilityFactory],
})
export class CaslModule {}
