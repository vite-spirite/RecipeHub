import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-github";
import * as dotenv from 'dotenv';
import { Provider } from "@prisma/client";
import { User } from "src/users/entities/user.entity";

const env = dotenv.config().parsed;

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
    constructor() {
        super({
            clientID: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
            callbackURL: env.GITHUB_CALLBACK_URL,
            scope: ['user']
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any, info?: any) => void) {
        
        const user: Omit<User, 'password'|'id'|'createdAt'|'updatedAt'> = {
            providerId: profile.id,
            provider: Provider.GITHUB,
            email: profile.emails ? profile.emails[0].value : null,
            firstName: profile.displayName.split(' ')[0],
            lastName: profile.displayName.split(' ')[1] || "",
            picture: profile.photos[0].value,
        };

        done(null, user);
    }
}