import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Provider } from "@prisma/client";
import * as dotenv from 'dotenv';
import { Strategy, VerifyFunction, Profile } from "passport-facebook";
import { User } from "src/users/entities/user.entity";

const env = dotenv.config().parsed;

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
    constructor() {
        super({
            clientID: env.FACEBOOK_CLIENT_ID,
            clientSecret: env.FACEBOOK_CLIENT_SECRET,
            callbackURL: env.FACEBOOK_CALLBACK_URL,
            profileFields: ['id', 'displayName', 'photos', 'email']
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any, info?: any) => void) {
        const user: Omit<User, 'password'|'id'|'createdAt'|'updatedAt'|'roles'> = {
            providerId: profile.id,
            provider: Provider.FACEBOOK,
            email: profile.emails ? profile.emails[0].value : null,
            firstName: profile.displayName.split(' ')[0],
            lastName: profile.displayName.split(' ')[1] || "",
            picture: profile.photos[0].value,
        };

        done(null, user);
    }
}