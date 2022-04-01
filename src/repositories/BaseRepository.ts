import { EntityRepository,  ObjectLiteral } from "typeorm";
import { Token } from "../entities/tokens/Token";
import { Service } from "typedi";
import { BaseRepository } from 'typeorm-transactional-cls-hooked';

@Service()
export class Repository<Entity extends ObjectLiteral> extends BaseRepository<Entity> {}
