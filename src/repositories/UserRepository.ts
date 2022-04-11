import {EntityRepository, EntityManager, getRepository, Like, Brackets} from "typeorm";
import {User} from "../entities/users/User";
import {Service} from "typedi";
import {Repository} from './BaseRepository';
import {UserResource} from '../resources/UserResource';

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
    async getInterlocators(userId: string, key: string | null = null) {
        const result = await this.createQueryBuilder("user")
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
                id: userId
            })
            .andWhere(`interlocators.id != :id`, {
                id: userId
            })
            .andWhere(new Brackets(qb => {
                if (key) return qb.where("interlocators.username like :key", {key: `%${key}%`});
            }))
            .getRawMany();

        return result.map((item) => {
            return UserResource.interlocator(item);
        })
    }

    /**
     * @param userId
     * @param key
     * @param ids
     */
    async search(userId: string, key: string, ids: string[]) {

        const result = await this.createQueryBuilder("user")
            .where("user.id != :id", {
                id: userId
            })
            .where("user.username like :key", {
                key: `%${key}%`
            })
            .andWhere("user.id NOT IN (:...ids)", {
                ids
            })
            .getMany();

        return result.map((item) => {
            return UserResource.user(item);
        })
    }

}
