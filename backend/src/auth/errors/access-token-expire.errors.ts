import { UnauthorizedException } from "@nestjs/common";

export class AccessTokenExpiredError extends UnauthorizedException {
    constructor() {
        super('Access token expired');
    }
}