import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JwtPayload } from "../dto/jwt-payload.dto";

export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user as JwtPayload;
    }
);