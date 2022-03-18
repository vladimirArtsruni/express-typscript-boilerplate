import { JsonController, Get, Req } from 'routing-controllers';
import { Request } from 'express';

@JsonController()
export class UserController {

    @Get('/users')
    @Req()
    async getAll(@Req() request: Request) {
        const users = await request.services.userService.index();
        return users
    }
}
