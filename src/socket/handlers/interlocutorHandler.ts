import   { Socket } from 'socket.io';
import { UserService } from '../../services/UserService';

export class InterlocutorHandler {

  private io: any;
  private socket: any;
  private userService?: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  public setupConnection(io: any, socket: Socket): InterlocutorHandler {
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
    return  this.userService!.getInterlocutors(userId);
  }
}
