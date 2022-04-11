import { EntityRepository } from 'typeorm';
import { ConversationUser } from '../entities/conversationUser/ConversationUser';
import { Service } from 'typedi';
import { Repository } from './BaseRepository';

@Service()
@EntityRepository(ConversationUser)
export class ConversationUserRepository extends Repository<ConversationUser> {

    /**
     * @param ids
     */
    async checkConversation(ids: string): Promise<{conversation: string}[]> {
        return this.createQueryBuilder('ConversationUser')
            .select([ 'ConversationUser.conversationId AS conversation' ])
            .groupBy('conversation')
            .having(`array_agg("userId" order by "userId") = array [${ids}]::uuid[]`)
            .getRawMany();

    }

}
