import { getManager } from 'typeorm';
import { UserRepository } from '../repositories/UserRepository';

export class UserService {

    constructor(private userRepository: UserRepository){}

    async index() {


        const users = await  this.userRepository.find();
        return users;
    }
}