import { JsonController, Get, Req } from 'routing-controllers';

@JsonController()
export class UserController {

    @Get('/users')
    @Req()
    async getAll(@Req() request: any) {
        const users = await request.services.userService.index();
        return { a: users}
    }
}
