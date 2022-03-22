import { JsonController, Post, Req, Body } from 'routing-controllers';
import { Request } from 'express';
import { LoginValidator } from '../validation/LoginValidator'

@JsonController('/auth')
export class AuthController {

    @Post('/login')
    async login(@Req() request: Request, @Body() body: LoginValidator) {
        const users = await request.services.authService.login(request, body);
        return users
    }
}