import { EntityRepository, EntityManager } from "typeorm";
import { User } from "../entities/users/User";
import { Service } from "typedi";
import { Repository } from './BaseRepository';

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
