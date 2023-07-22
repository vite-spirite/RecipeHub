import { CanActivate, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { config } from "process";
import { AccessTokenExpiredError } from "../errors/access-token-expire.errors";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
    constructor(private jwtService: JwtService, private config: ConfigService) {
        super();
    }

    async canActivate(context) {
        
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if(!token) {
            throw new UnauthorizedException();
        }

        try {
            const payload = await this.jwtService.verifyAsync(token);
            request.user = payload;
            return true;
        } catch(e) {
            throw new AccessTokenExpiredError();
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers["authorization"].split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}