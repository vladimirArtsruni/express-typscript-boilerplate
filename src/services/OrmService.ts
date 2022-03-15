import { EntityTarget, Entity, getRepository, Repository } from "typeorm";

export class OrmService {
    repository: Repository<typeof Entity>;
    constructor(entity: EntityTarget<typeof Entity>) {
         this.repository = getRepository(entity);
    }
}