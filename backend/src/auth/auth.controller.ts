import { Body, Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBody, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CredentialsAuthDto } from './dto/credentials-auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { TokensAuthDto } from './dto/tokens-auth.dto';
import { RefreshBodyAuthDto } from './dto/refresh-body-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { FacebookAuthGuard } from './guards/facebook-auth.guard';
import { GithubAuthGuard } from './guards/github-auth.guard';
import { TwitterStrategy } from './strategy/twitter.strategy';
import { TwitterAuthGuard } from './guards/twitter-auth.guard';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@ApiTags('authentification')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private configService: ConfigService) {}

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

    @UseGuards(GoogleAuthGuard)
    @Get("google")
    async googleAuth(@Request() req) {}

    @UseGuards(GoogleAuthGuard)
    @Get("google/redirect")
    async googleAuthRedirect(@Request() req, @Res() res: Response) {
        const _token = await this.authService.signInWithSocialProvider(req.user);
        res.redirect(this.configService.get<string>('REDIRECT_AUTH_PROVIDER')+_token.refreshToken);
    }

    @UseGuards(FacebookAuthGuard)
    @Get("facebook")
    async facebookAuth(@Request() req) {}

    @UseGuards(FacebookAuthGuard)
    @Get("facebook/redirect")
    async facebookAuthRedirect(@Request() req, @Res() res : Response) {
        const _token = await this.authService.signInWithSocialProvider(req.user);
        res.redirect(this.configService.get<string>('REDIRECT_AUTH_PROVIDER')+_token.refreshToken);
    }

    @UseGuards(GithubAuthGuard)
    @Get("github")
    async githubAuth(@Request() req) {}

    @UseGuards(GithubAuthGuard)
    @Get("github/redirect")
    async githubAuthRedirect(@Request() req, @Res() res: Response) {
        const _token = await this.authService.signInWithSocialProvider(req.user);
        res.redirect(this.configService.get<string>('REDIRECT_AUTH_PROVIDER')+_token.refreshToken);
    }

    @UseGuards(TwitterAuthGuard)
    @Get("twitter")
    async twitterAuth(@Request() req) {}

    @UseGuards(TwitterAuthGuard)
    @Get("twitter/redirect")
    async twitterAuthRedirect(@Request() req, @Res() res: Response) {
        const _token = await this.authService.signInWithSocialProvider(req.user);
        res.redirect(this.configService.get<string>('REDIRECT_AUTH_PROVIDER')+_token.refreshToken);
    }

}


