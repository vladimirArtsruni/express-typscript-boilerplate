import { OrmService } from './OrmService';
import { EntityTarget, Entity, getRepository, Repository } from "typeorm";

export class UserService extends  OrmService {
     constructor(entity: EntityTarget<typeof Entity>) {
           super(entity)
     }

     async getAll(){
         return this.repository.findAndCount();
     }
}