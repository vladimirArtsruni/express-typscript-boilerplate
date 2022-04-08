import {ConversationRepository} from "../repositories/ConversationRepository";
import {Conversation} from "../entities/conversation/Conversation";
import {Service} from "typedi";
import {InjectRepository} from "typeorm-typedi-extensions";
import {Like} from "typeorm";

@Service()
export class ConversationService {

    /**
     * @param conversationRepository
     */
    constructor(
        @InjectRepository()
        private readonly conversationRepository: ConversationRepository) {
    }

    /**
     * @param id
     */
    async getById(id: string): Promise<Conversation | undefined> {
        return this.conversationRepository.findOne(id);
    }

    /**
     * @param conversationId
     * @param authUserId
     */
    async getMessages(conversationId: string, authUserId: string) {

        const messages = await this.conversationRepository.findOne(conversationId, {
            relations: ['messages', 'messages.user']
        });

        return { data: messages }
    }
}
