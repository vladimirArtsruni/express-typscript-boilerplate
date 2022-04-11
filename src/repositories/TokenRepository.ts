import { EntityRepository } from 'typeorm';
import { Token } from '../entities/tokens/Token';
import { Service } from 'typedi';
import { Repository } from './BaseRepository';

@Service()
@EntityRepository(Token)
export class TokenRepository extends Repository<Token> {}
