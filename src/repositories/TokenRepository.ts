import { EntityRepository, Repository } from "typeorm";
import { Token } from "../entities/tokens/Token";
import { Service } from 'typedi';

@Service()
@EntityRepository(Token)
export class TokenRepository extends Repository<Token> {}