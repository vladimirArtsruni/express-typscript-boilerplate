import {JsonController, Get, Req, Body, Authorized} from 'routing-controllers';
import {Request} from 'express';
import {UserService} from '../services/UserService';
import {Container, Service, Inject} from 'typedi';

@Service()
@JsonController('/users')
export class UserController {


    constructor(private userService: UserService) {}

    @Get('/')
    async getAll(@Req() request: Request) {
        const b = await this.userService.index();

        return {a: 4}
    }

    @Get('/')
    async create(@Req() request: Request) {
        const b = await this.userService.index();

        return {a: 4}
    }

}

