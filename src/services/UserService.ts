import { getManager } from 'typeorm';
import { UserRepository } from '../repositories/UserRepository';

export class UserService {
    customClass: UserRepository;

    constructor(userRepository: UserRepository){
        this.customClass = userRepository;
    }

    async index() {
        console.log(this.customClass);


        const users = await  this.customClass.alo();
        return users;
    }
}