import { JsonController, Get, Authorized, QueryParam } from 'routing-controllers';
import { UserService } from '../services/UserService';
import { Service } from 'typedi';

@Service()
@JsonController('/users')
export class UserController {

    constructor(private userService: UserService) {}

    @Get('/search')
    @Authorized()
    async search(@QueryParam("key") serchKey: string ) {
        return this.userService.search(serchKey);
    }
}

