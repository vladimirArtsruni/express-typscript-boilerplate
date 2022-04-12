import { Socket } from 'socket.io';
import { ConversationService } from '../../services/ConversationService';
import { UserService } from '../../services/UserService';
import { MessageResource } from '../../resources/MessageResource';
import { Message } from '../../entities/message/Message';
import { User } from '../../entities/users/User';
import { Redis } from '../../redis';

export class MessageHandler {

  private io: any;
  private authUser?: User;
  private socket: any;
  private conversationService?: ConversationService;
  private userService?: UserService;
  private redis?: Redis;

  /**
   * @param conversationService
   * @param userService
   */
  constructor(conversationService: ConversationService, userService: UserService) {
    this.conversationService = conversationService;
    this.userService = userService;
  }

  /**
   * @param io
   * @param socket
   * @param redis
   */
  public setupConnection(io: any, socket: Socket,redis: Redis): MessageHandler {
    this.io = io;
    this.socket = socket;
    this.redis = redis;
    this.authUser = this.socket.data.user;
    return this;
  }

  public init() {
    this.socket.on('NEW_MESSAGE', this.newMessage.bind(this))
  }

  private async newMessage(arg: any) {

    const authId = arg.authId;

    let message: Message;
    if (arg.conversationId) {
        message = await this.conversationService!.createMessage(arg.conversationId, authId, arg.message);
    }else {
        message = await this.conversationService!.create( authId, arg);
    }
    message.user =  await this.userService!.getById(authId) as User;
    const resource =  MessageResource.message(message);
    this.io.sockets.in(message.conversationId).emit('NEW_MESSAGE_RESULT', resource);

    console.log(this.io.sockets.adapter.rooms)
  }
}
