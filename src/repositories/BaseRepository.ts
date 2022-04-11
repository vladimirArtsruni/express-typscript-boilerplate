import { ObjectLiteral } from 'typeorm';
import { Service } from 'typedi';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';

@Service()
export class Repository<Entity extends ObjectLiteral> extends BaseRepository<Entity> {}
