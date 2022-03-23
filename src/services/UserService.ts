import { getManager } from 'typeorm';
import { UserRepository } from '../repositories/UserRepository';
import { User } from '../entities/users/User';

export class UserService {

    constructor(private userRepository: UserRepository){}

    async index() {
        const users = await this.userRepository.find();
        return users;
    }


    /**
     * @param email
     */
    async getByEmail(email: string): Promise<User | undefined>  {
       return this.userRepository.findOne({ where: { email } });
    }

    /**
     * @param id
     */
    async getById(id: string): Promise<User | undefined>  {
        return this.userRepository.findOne({ where: { id } });
    }
}