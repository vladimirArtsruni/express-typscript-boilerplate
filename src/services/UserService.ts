import { UserRepository } from "../repositories/UserRepository";
import { User } from "../entities/users/User";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";

@Service()
export class UserService {

  /**
   * @param userRepository
   */
  constructor(
    @InjectRepository()
    private readonly userRepository: UserRepository) {
  }

  async getAll() {
    return this.userRepository.find();
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
}
