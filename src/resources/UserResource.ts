import { Conversation } from '../entities/conversation/Conversation';
import { User } from '../entities/users/User';

interface IConversation {
    id: string;
    lastActivity: Date;
}

export interface IUserResource {
    id: string;
    email: string;
    username: string;
    avatar: string;
    conversation?: IConversation;
}

export class UserResource {

    public static interlocator(interlocator: any): IUserResource {
        return {
            id: interlocator.id,
            email: interlocator.email,
            username: interlocator.username,
            avatar: interlocator.avatar,
            conversation: {
                id: interlocator.conversationid,
                lastActivity: interlocator.lastactivity
            }
        }
    }

    public static user(user: User): IUserResource {
        return {
            id: user.id,
            email: user.email,
            username: user.username,
            avatar: user.avatar
        }
    }

    public static conversation(conversation: Conversation, authId: string): IUserResource {

        const user = conversation.users.filter((user) => {
            return user.id !== authId;
        })[ 0 ];

        return {
            id: user.id,
            email: user.email,
            username: user.username,
            avatar: user.avatar,
            conversation: {
                id: conversation.id,
                lastActivity: conversation.updatedAt
            }
        }
    }
}
