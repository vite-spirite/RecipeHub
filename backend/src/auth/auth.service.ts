import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import {CACHE_MANAGER, CacheStore} from '@nestjs/cache-manager';
import { User } from 'src/users/entities/user.entity';
import { TokensAuthDto } from './dto/tokens-auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(@Inject(CACHE_MANAGER) private cache: CacheStore, private userService: UsersService, private jwtService: JwtService) {}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.findByEmail(email);
        if (user && user.password === password) {
            const { password, picture, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: Omit<User, 'password'|'picture'>): Promise<TokensAuthDto> {
        return {
            refreshToken: await this.generateRefreshToken(user),
            accessToken: this.jwtService.sign(user),
        }
    }

    async refresh(refreshToken: string): Promise<string> {
        const {id, iter_refresh} = this.jwtService.verify(refreshToken);

        const iter_refresh_cache = +(await this.cache.get(`users:${id}`));
        console.log(iter_refresh_cache, iter_refresh);

        if(!iter_refresh_cache || iter_refresh_cache !== iter_refresh) {
            throw new UnauthorizedException();
        }

        return await this.generateAccessToken(await this.userService.findById(id));

    }

    private async generateRefreshToken(user: Omit<User, 'password'|'picture'>): Promise<string> {
        let iter_refresh = +(await this.cache.get(`users:${user.id}`));

        if(!iter_refresh) {
            iter_refresh = 1;
            await this.cache.set(`users:${user.id}`, iter_refresh);
        } else {
            iter_refresh++;
            await this.cache.set(`users:${user.id}`, iter_refresh);
        }

        return this.jwtService.sign({id: user.id, iter_refresh}, {expiresIn: '7d'});
    }

    private async generateAccessToken(user: Omit<User, 'password'|'picture'>): Promise<string> {
        return this.jwtService.sign(user);
    }
}
