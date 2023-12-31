import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import {CACHE_MANAGER, CacheStore} from '@nestjs/cache-manager';
import { User } from 'src/users/entities/user.entity';
import { TokensAuthDto } from './dto/tokens-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { Provider } from '@prisma/client';
import { EmailExistError } from './errors/email-exist.error';

@Injectable()
export class AuthService {
    constructor(@Inject(CACHE_MANAGER) private cache: CacheStore, private userService: UsersService, private jwtService: JwtService) {}

    async validateUser(email: string, password: string): Promise<any> {
        
        const user = await this.userService.findByEmail(email);

        if (user && user.provider === Provider.LOCAL && await this.userService.comparePassword(password, user.password)) {
            const { password, picture, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: Omit<User, 'password'|'picture'>): Promise<TokensAuthDto> {
        const _user = await this.userService.findById(user.id);

        const {password, ...data} = _user;

        return {
            refreshToken: await this.generateRefreshToken(user),
            accessToken: await this.generateAccessToken(data),
        }
    }

    async isUserExistWithSocialProvider(provider: Provider, providerId: string): Promise<boolean> {
        return !!(await this.userService.findByProviderId(provider, providerId));
    }

    async signInWithSocialProvider(data: Omit<User, 'password'>): Promise<TokensAuthDto> {
        const _user = await this.userService.findByProviderId(data.provider, data.providerId);

        if(data.email && !_user && await this.userService.findByEmail(data.email)) {
            throw new EmailExistError();
        }

        if(!_user) {
            const user = await this.userService.create({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                picture: data.picture,
                providerId: data.providerId,
                provider: data.provider,
                password: null,
                passwordConfirmation: null,
            });
            return this.login(user);
        }

        return this.login(_user);
    }

    async refresh(refreshToken: string): Promise<string> {
        const {id, iter_refresh} = this.jwtService.verify(refreshToken);

        const iter_refresh_cache = +(await this.cache.get(`users:${id}`));

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

    private async generateAccessToken(user: Omit<User, 'password'>): Promise<string> {
        return this.jwtService.sign(user);
    }
}
