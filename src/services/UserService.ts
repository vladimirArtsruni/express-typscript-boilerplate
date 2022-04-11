import { UserRepository } from '../repositories/UserRepository';
import { User } from '../entities/users/User';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Like, Not  } from 'typeorm';
import { UserResource } from '../resources/UserResource';

@Service()
export class UserService {

    /**
     * @param userRepository
     */
    constructor(
        @InjectRepository()
        private readonly userRepository: UserRepository) {
    }

    async search(key: string, authId: string) {

        const result = await this.userRepository.find({
            username: Like(`%${key}%`),
            id: Not(authId)
        });

        const rsource = result.map((user) => {
            return UserResource.user(user)
        })

        return  { data: rsource  };
    }

    /**
     * @param email
     */
    async getByEmail(email: string): Promise<User | undefined> {
        return this.userRepository.findOne({ where: { email } });
    }

    /**
     * @param id
     */
    async getById(id: string): Promise<User | undefined> {
        return this.userRepository.findOne({ where: { id } });
    }

    /**
     * @param userId
     * @param searchKey
     */
    async getInterlocutors(userId: string, searchKey: string | null = null) {
        return this.userRepository.getInterlocutors(userId, searchKey);
    }

    /**
     * @param userId
     * @param key
     */
    async searchInterlocutors(userId: string, key: string) {
        const interlocutors = await this.userRepository.getInterlocutors(userId, key);
        const interlocutorsIds = interlocutors.map((interlocutor) => {
            return interlocutor.id;
        });

        interlocutorsIds.push(userId);

        const users = await this.userRepository.search(userId, key, interlocutorsIds);

        return { interlocutors, users }
    }

}
