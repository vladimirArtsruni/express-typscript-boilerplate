import   { Socket } from 'socket.io';
import { UserService } from '../../services/UserService';
import { User } from '../../entities/users/User';

export class InterlocutorHandler {

  private io: any;
  private socket: any;
  private userService?: UserService;
  private authUser?: User;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  public setupConnection(io: any, socket: Socket): InterlocutorHandler {
    this.io = io;
    this.socket = socket;
    this.authUser = this.socket.data.user;
    return this;
  }

  public init() {
    this.socket.on('GET_INTERLOCUTORS', async (arg: any) => {
      this.socket.emit('GET_INTERLOCUTORS_RESULT', this.getInterlocutors(arg.authId))
    });
  }

  private async getInterlocutors(authId: string) {
    return  this.userService!.getInterlocutors(authId);
  }
}
