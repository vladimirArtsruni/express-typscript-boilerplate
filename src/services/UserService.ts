import { getManager } from 'typeorm';
import { UserRepository } from '../repositories/UserRepository';

export class UserService {
    private userRepository: UserRepository;

    constructor(){
        this.userRepository = getManager().getCustomRepository(UserRepository);
    }

    async index() {
        const users = await this.userRepository.find();
        return users;
    }
}