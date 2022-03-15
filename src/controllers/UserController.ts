import { Controller, Get } from 'routing-controllers';
import { UserService } from '../services/UserService'
@Controller()
export class UserController {
    service: UserService;
    constructor() {
        this.service = new UserService();
    }
    @Get('/users')
    getAll() {
        return this.service.index()
    }
}
