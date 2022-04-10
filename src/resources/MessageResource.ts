import { Conversation } from '../entities/conversation/Conversation';
import { Message } from '../entities/message/Message';
import { IUserResource, UserResource } from './UserResource';


export interface IMessageResource {
    id: string,
    text: string,
    createdAt: Date,
    user: IUserResource
}

export class MessageResource {

    public static message(message: Message) {
        return {
            id: message.id,
            text: message.text,
            created: message.createdAt,
            user: UserResource.user(message.user)
        }
    }
}
