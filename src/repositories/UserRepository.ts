import {EntityRepository, EntityManager, getRepository, Like, Brackets} from "typeorm";
import {User} from "../entities/users/User";
import {Service} from "typedi";
import {Repository} from './BaseRepository';

@Service()
@EntityRepository(User)
export class UserRepository extends Repository<User> {

    /**
     * @param email
     */
    async getByEmail(email: string) {
        return this.findOne({where: {email}});
    }

    /**
     * @param username
     */
    async getByUsername(username: string) {
        return this.findOne({where: {username}});
    }

    /**
     * @param authId
     * @param key
     */
    async getInterlocators(authId: string, key: string | null = null) {
        return this.createQueryBuilder("user")
            .innerJoin(
                'user.conversations',
                'conversation',
            )
            .leftJoin('conversation.users', 'interlocators')
            .select([
                "conversation.id as conversationId",
                "conversation.updatedAt as lastActivity",
                "interlocators.id AS id",
                "interlocators.email AS email",
                "interlocators.username AS username",
                "interlocators.avatar as avatar",
            ])
            .where("user.id = :id", {
                id: authId
            })
            .andWhere(`interlocators.id != :id`, {
                id: authId
            })
            .andWhere(new Brackets( qb => {
                if (key) return qb.where("interlocators.username like :key", { key: `%${key}%` });
            }))
            .getRawMany();
    }

    /**
     * @param authId
     * @param key
     */
    async searchInterlocators(authId: string, key: string | null = null) {
        return this.createQueryBuilder("user")
            .innerJoin(
                'user.conversations',
                'conversation',
            )
            .leftJoin('conversation.users', 'interlocators')
            .select([
                "interlocators.id AS id",
                "interlocators.email AS email",
                "interlocators.username AS username",
                "interlocators.avatar as avatar",
            ])
            .where("user.id = :id", {
                id: authId
            })
            .andWhere(`interlocators.id != :id`, {
                id: authId
            })
            .andWhere(new Brackets( qb => {
                if (key) return qb.where("interlocators.username like :key", { key: `%${key}%` });
            }))
            .getRawMany();
    }
}
