import { JsonController, Get, Authorized, QueryParam, Req } from 'routing-controllers';
import { UserService } from '../services/UserService';
import { Service } from 'typedi';
import { Request } from 'express';

@Service()
@JsonController('/users')
export class UserController {

    constructor(private userService: UserService) {}
    
    
}

