import { Socket } from 'socket.io';
import { ConversationService } from '../../services/ConversationService';
import { MessageResource } from '../../resources/MessageResource';
import { Message } from '../../entities/message/Message';
import { User } from '../../entities/users/User';

export class MessageHandler {

  private io: any;
  private authUser?: User;
  private socket: any;
  private conversationService?: ConversationService;

  constructor(conversationService: ConversationService) {
    this.conversationService = conversationService;
  }

  public setupConnection(io: any, socket: Socket): MessageHandler {
    this.io = io;
    this.socket = socket;
    this.authUser = this.socket.data.user;
    return this;
  }

  public init() {
    this.socket.on('NEW_MESSAGE', this.newMessage.bind(this))
  }

  private async newMessage(arg: any) {
    let message: Message;
    if (arg.conversationId) {
        message = await this.conversationService!.createMessage(arg.conversationId, this.authUser!.id, arg.message);
    }else {
        message = await this.conversationService!.create(this.authUser!.id, arg);
    }
    message.user =  this.authUser!;
    const resource =  MessageResource.message(message);
    this.io.sockets.in(message.conversationId).emit('NEW_MESSAGE_RESULT', resource);

  }
}
