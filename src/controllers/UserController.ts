import { JsonController } from 'routing-controllers';
import { UserService } from '../services/UserService';
import { Service } from 'typedi';

@Service()
@JsonController('/users')
export class UserController {

    constructor(private userService: UserService) {}
}

