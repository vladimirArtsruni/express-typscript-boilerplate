import { JsonController, Post, Req, Body, Authorized } from 'routing-controllers';
import { Request } from 'express';
import { LoginValidator } from '../validation/auth/LoginValidator'
import { RegisterValidator } from '../validation/auth/RegisterValidator'

@JsonController('/auth')
export class AuthController {

    // @Post('/login')
    // async login(@Req() request: Request, @Body() body: LoginValidator) {
    //     return body
    // }

    @Post('/register')
    async login(@Req() request: Request, @Body() body: RegisterValidator) {
        return body
    }
}