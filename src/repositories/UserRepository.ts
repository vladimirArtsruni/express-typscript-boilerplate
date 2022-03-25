import { EntityRepository, Repository } from "typeorm";
import { User } from "../entities/users/User";
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Service } from 'typedi';

@Service()
@EntityRepository(User)
export class UserRepository extends Repository<User> {}