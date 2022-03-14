import { Controller, Get } from 'routing-controllers';

@Controller()
export class UserController {
    @Get('/users')
    getAll() {
        return 'This action returns all users';
    }
}
