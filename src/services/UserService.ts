import {UserRepository} from "../repositories/UserRepository";
import {User} from "../entities/users/User";
import {Service} from "typedi";
import {InjectRepository} from "typeorm-typedi-extensions";
import {Like} from "typeorm";
import { UserResource } from '../resources/UserResource'

@Service()
export class UserService {

    /**
     * @param userRepository
     */
    constructor(
        @InjectRepository()
        private readonly userRepository: UserRepository) {
    }

    async search(key: string) {

        let result = await this.userRepository.find({
            username: Like(`%${key}%`),
        });

        // @ts-ignore
        result = result.map((user) => {
            return UserResource.user(user)
        })

        return  { data: result };
    }

    /**
     * @param email
     */
    async getByEmail(email: string): Promise<User | undefined> {
        return this.userRepository.findOne({where: {email}});
    }

    /**
     * @param id
     */
    async getById(id: string): Promise<User | undefined> {
        return this.userRepository.findOne({where: {id}});
    }
}
