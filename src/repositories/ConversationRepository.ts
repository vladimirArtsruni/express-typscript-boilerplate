import { EntityRepository } from "typeorm";
import { Conversation } from "../entities/conversation/Conversation";
import { Service } from "typedi";
import { Repository } from './BaseRepository';

@Service()
@EntityRepository(Conversation)
export class ConversationRepository extends Repository<Conversation> {}
