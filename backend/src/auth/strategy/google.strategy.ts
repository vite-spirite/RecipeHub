import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";

import * as dotenv from 'dotenv';
import { VerifiedCallback } from "passport-jwt";
import { User } from "src/users/entities/user.entity";
import { Provider } from "@prisma/client";

const env = dotenv.config().parsed;

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google'){
    constructor() {
        super({
            clientID: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            callbackURL: env.GOOGLE_CALLBACK_URL,
            scope: ['email', 'profile']
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifiedCallback) {
        const {id, name, emails, photos} = profile;
        const user: Omit<User, 'password'|'id'|'createdAt'|'updatedAt'> = {
            providerId: id,
            provider: Provider.GOOGLE,
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,

        }

        done(null, user);
    }
}