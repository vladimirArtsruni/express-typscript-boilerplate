import { ConversationRepository } from '../repositories/ConversationRepository';
import { UserRepository } from '../repositories/UserRepository';
import { MessageRepository } from '../repositories/MessageRepository';
import { ConversationUserRepository } from '../repositories/ConversationUserRepository';
import { Conversation } from '../entities/conversation/Conversation';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { ConversationDto } from '../dto/chat/ConversationDto';
import { MessageDto } from '../dto/chat/MessageDto';
import { MessageResource } from '../resources/MessageResource';
import { Transactional } from 'typeorm-transactional-cls-hooked';

@Service()
export class ConversationService {

    /**
     * @param conversationRepository
     * @param userRepository
     * @param messageRepository
     * @param conversationUserRepository
     */
    constructor(
        @InjectRepository() private readonly conversationRepository: ConversationRepository,
        @InjectRepository() private readonly userRepository: UserRepository,
        @InjectRepository() private readonly messageRepository: MessageRepository,
        @InjectRepository() private readonly conversationUserRepository: ConversationUserRepository
    ) {
    }

    /**
     * @param id
     */
    async getById(id: string): Promise<Conversation | undefined> {
        return this.conversationRepository.findOne(id);
    }

    /**
     * @param conversationId
     */
    async getMessages(conversationId: string) {

        const result = await this.messageRepository.find({
            where: { conversationId },
            relations: [ 'user' ],
            order: { createdAt: 'ASC' }
        });

        const messages = result.map((message) => {
            return MessageResource.message(message);
        })

        return { data: messages }
    }

    /**
     * @param authId
     * @param data
     */
    @Transactional()
    async create(authId: string, data: ConversationDto) {

        const usersIds = [ authId, data.userId ]
            .sort((a, b) => a.localeCompare(b))
            .map(i => `'${i}'`)
            .sort((a, b) => a.localeCompare(b)).join(',');

        const result = await this.conversationUserRepository.checkConversation(usersIds);

        let conversation: Conversation;

        if (result.length) {
            conversation = await this.conversationRepository.findOne(result[ 0 ].conversation) as Conversation;
        } else {

            conversation = await this.conversationRepository.save({});

            await this.conversationUserRepository.save([
                { conversationId: conversation.id, userId: authId },
                { conversationId: conversation.id, userId: data.userId }
            ]);
        }

        return this.createMessage(conversation.id, authId, data.message);
    }

    /**
     * @param conversationId
     * @param userId
     * @param data
     */
    @Transactional()
    async createMessage(conversationId: string, userId: string, data: MessageDto) {
        return await this.messageRepository.save({
            ...data,
            userId,
            conversationId
        })
    }
}
