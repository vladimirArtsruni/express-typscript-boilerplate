import { JsonController, Get, Req, Body } from 'routing-controllers';
import { Request } from 'express';
@JsonController('/users')
export class UserController {

    @Get('/')
    @Req()
    async getAll(@Req() request: Request) {
        const users = await request.services.userService.index();
        return users
    }
}
