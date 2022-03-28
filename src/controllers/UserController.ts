import { JsonController, Get, Authorized } from 'routing-controllers';
import { UserService } from '../services/UserService';
import { Service } from 'typedi';

@Service()
@JsonController('/users')
export class UserController {

    constructor(private userService: UserService) {}

    @Get('/')
    @Authorized()
    async getAll() {
       return this.userService.getAll();
    }
}

