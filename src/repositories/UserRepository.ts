import { EntityRepository, Repository } from "typeorm";
import { User } from "../entities/users/User";
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Service } from 'typedi';

@Service()
@EntityRepository(User)
export class UserRepository extends Repository<User> {


    /**
     * @param email
     */
    async getByEmail(email: string) {
        return this.findOne({ where: { email } });
    }

    /**
     * @param username
     */
    async getByUsername(username: string) {
        return this.findOne({ where: { username } });
    }
}