import { JsonController, Get, Authorized, QueryParam, Req } from 'routing-controllers';
import { UserService } from '../services/UserService';
import { Service } from 'typedi';
import { Request } from 'express';

@Service()
@JsonController('/users')
export class UserController {

    constructor(private userService: UserService) {}

    @Get('/search')
    @Authorized()
    async search(@QueryParam("key") serchKey: string, @Req() req: Request ) {
        return this.userService.search(serchKey, req.user.id);
    }
}

