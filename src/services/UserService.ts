import { UserRepository } from '../repositories/UserRepository';
import { User } from '../entities/users/User';
import { Service } from 'typedi';
import { InjectRepository, InjectManager } from 'typeorm-typedi-extensions';
import { Repository,EntityManager  } from 'typeorm';

@Service()
export class UserService {

    constructor(
        @InjectRepository()
        private readonly userRepository: UserRepository)
    {}

    async index() {
       return this.userRepository.find();
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