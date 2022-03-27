import { JsonController, Get, Req, Authorized, CurrentUser } from 'routing-controllers';
import { Request } from 'express';
import { UserService } from '../services/UserService';
import { Service, Inject } from 'typedi';
import { User } from '../entities/users/User';
import { Roles } from '../entities/users/types';

@Service()
@JsonController('/users')
export class UserController {

    constructor(private userService: UserService) {}

    @Get('/')
    @Authorized()
    async getAll(@Req() request: Request) {
       return this.userService.getAll();
    }
}

