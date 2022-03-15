import { Controller, Get } from 'routing-controllers';
import services from '../services'
@Controller()
export class UserController {
    @Get('/users')
    getAll() {
        return 1
    }
}
