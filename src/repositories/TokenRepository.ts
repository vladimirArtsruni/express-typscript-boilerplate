import { EntityRepository, Repository } from 'typeorm';
import { Token } from '../entities/tokens/Token';

@EntityRepository(Token)
export class TokenRepository extends Repository<Token> {

}