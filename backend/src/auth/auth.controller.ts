import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBody, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CredentialsAuthDto } from './dto/credentials-auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { TokensAuthDto } from './dto/tokens-auth.dto';
import { RefreshBodyAuthDto } from './dto/refresh-body-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('authentification')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @ApiBody({type: CredentialsAuthDto})
    @ApiOkResponse({type: TokensAuthDto})
    @Post('login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }
    
    @Post('refresh')
    @ApiBody({type: RefreshBodyAuthDto})
    @ApiOkResponse({type: String})
    async refresh(@Body() body: RefreshBodyAuthDto) {
        return this.authService.refresh(body.refreshToken);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('me')
    async getMe(@Request() req) {
        return req.user;
    }
}


