import { JsonController, Post, Body, Req, Get, Authorized } from 'routing-controllers';
import { LoginDto } from '../dto/auth/LoginDto';
import { RegisterDto } from '../dto/auth/RegisterDto';
import { RefreshTokenDto } from '../dto/auth/RefreshTokenDto';
import { ForgotPassword } from '../dto/auth/ForgotPassword';
import { RessetPassword } from '../dto/auth/RessetPassword';
import { AuthService } from '../services/AuthService';
import { Request } from 'express';

@JsonController('/auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/register')
    async register(@Req() req: Request, @Body() body: RegisterDto) {
        return this.authService.register(body, req.ip);
    }

    @Post('/login')
    async login(@Req() req: Request, @Body() body: LoginDto) {
        return this.authService.login(body, req.ip);
    }

    @Post('/refreshToken')
    async refreshToken(@Req() req: Request, @Body() body: RefreshTokenDto) {
        return this.authService.refreshToken(body.token, req.ip);
    }

    @Post('/forgotPassword')
    async forgotPassword(@Req() req: Request, @Body() body: ForgotPassword) {
        await this.authService.forgotPassword(body, req.ip);
        return true;
    }

    @Post('/ressetPassword')
    async ressetPassword(@Req() req: Request, @Body() body: RessetPassword) {
        return this.authService.ressetPassword(body, req.ip);
    }

    @Get('/user')
    @Authorized()
    async authUser(@Req() req: Request) {
        // @ts-ignore
        return req.user;
    }
}
