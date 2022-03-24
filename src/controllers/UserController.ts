import { JsonController, Get, Req, Body, Authorized } from 'routing-controllers';
import * as passport from 'passport';
import { Request } from 'express';
@JsonController('/users')
export class UserController {

    @Get('/')
    @Authorized()
    async getAll(@Req() request: Request) {
        const users = await request.services.userService.index();
        return users
    }
}
