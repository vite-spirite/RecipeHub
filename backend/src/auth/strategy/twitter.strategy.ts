import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-twitter";
import { Injectable } from "@nestjs/common";
import * as dotenv from 'dotenv';
import { Provider } from "@prisma/client";
import { User } from "src/users/entities/user.entity";

const env = dotenv.config().parsed;

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy, 'twitter') {
    constructor() {
        super({
            consumerKey: process.env.TWITTER_CLIENT_ID,
            consumerSecret: process.env.TWITTER_CLIENT_SECRET,
            callbackURL: process.env.TWITTER_CALLBACK_URL,
            includeEmail: true,
            passReqToCallback: true
        });
    }

    async validate(req: any, accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any, info?: any) => void) {
        const user: Omit<User, 'password'|'id'|'createdAt'|'updatedAt'|'roles'> = {
            providerId: profile.id,
            provider: Provider.TWITTER,
            email: profile.emails ? profile.emails[0].value : null,
            firstName: profile.displayName.split(' ')[0],
            lastName: profile.displayName.split(' ')[1] || "",
            picture: profile.photos[0].value,
        };

        done(null, user);
    }
}