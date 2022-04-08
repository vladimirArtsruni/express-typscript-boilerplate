import { Conversation } from '../entities/conversation/Conversation';
import { User } from '../entities/users/User';

export class UserResource {

    public static user(user: User) {
        return {
            id: user.id,
            email: user.email,
            username: user.username,
            avatar: user.avatar
        }
    }

    public static conversation(conversation: Conversation, authId: string) {
        
        const user = conversation.users.filter((user) => {
            return user.id !== authId;
        })[0];
        
        return {
               id: user.id,
               email: user.email,
               username: user.username,
               avatar: user.avatar,
               conversation: {
                   id: conversation.id,
                   lastActivity: conversation.updateddAt
               }
        }
    }
}
