import { Socket, Server } from 'socket.io';
import { UserService } from '../../services/UserService';
import { User } from '../../entities/users/User';
import { Redis } from '../../redis';

export class ProfileHandler {

  private io: any;
  private socket: any;
  private userService?: UserService;
  private authUser?: User;
  private redis?: Redis;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  public setupConnection(io: Server, socket: Socket, redis: Redis): ProfileHandler {
    this.io = io;
    this.socket = socket;
    this.redis = redis;
    this.authUser = this.socket.data.user;
    return this;
  }

  public init() {
    this.socket.on('GET_INTERLOCUTORS', async (arg: any) => {
      this.socket.emit('GET_INTERLOCUTORS_RESULT', await this.getInterlocutors(arg.authId))
    });
  }

  private async getInterlocutors(authId: string) {
    const interlocutors = await this.userService!.getInterlocutors(authId);
    interlocutors.map( async (interlocutor) => {
      this.socket.join(interlocutor.conversation?.id);
      const isOnline = await this.redis!.get(interlocutor.id);
      if (isOnline) this.socket.emit('USER_ONLINE', { userId: interlocutor.id  })
    });

    return interlocutors;
  }
}
