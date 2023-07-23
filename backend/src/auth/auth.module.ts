import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport/dist';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { GoogleStrategy } from './strategy/google.strategy';
import { FacebookStrategy } from './strategy/facebook.strategy';
import { GithubStrategy } from './strategy/github.strategy';
import { TwitterStrategy } from './strategy/twitter.strategy';

@Module({
    imports: [
        PassportModule,
        UsersModule,
        CacheModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({
                store: await redisStore({
                    socket: {
                        host: config.get('REDIS_HOST'),
                        port: parseInt(config.get('REDIS_PORT')),
                    },
                    database: parseInt(config.get('REDIS_REFRESH_TOKEN_DB')),
                    password: config.get('REDIS_PASSWORD'),
                }),
            }),
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({                
                secret: config.get('JWT_SECRET'),
                signOptions: {
                    expiresIn: '60s'
                }
            }),
        }),
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy, GoogleStrategy, FacebookStrategy, GithubStrategy, TwitterStrategy],
    controllers: [AuthController],
})
export class AuthModule {}
