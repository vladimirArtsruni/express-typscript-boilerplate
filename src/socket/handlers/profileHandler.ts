import { Socket, Server } from 'socket.io';
import { UserService } from '../../services/UserService';

export class ProfileHandler {

  private io: any;
  private socket: any;
  private userService?: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  public setupConnection(io: Server, socket: Socket): ProfileHandler {
    this.io = io;
    this.socket = socket;
    return this;
  }

  public init() {
    this.socket.on('GET_INTERLOCUTORS', async () => {
      this.socket.emit('GET_INTERLOCUTORS_RESULT', await this.getInterlocutors())
    });
  }

  private async getInterlocutors() {
    const userId = this.socket.data.user.id;
    const interlocutors = await this.userService!.getInterlocutors(userId);

    interlocutors.map((interlocutor) => {
      this.socket.join(interlocutor.conversation?.id);
    });

    return interlocutors;
  }
}
