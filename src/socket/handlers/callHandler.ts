import   { Socket } from 'socket.io';
import { UserService } from '../../services/UserService';
import { Redis } from '../../redis';

interface IOnOffer {
    from: string;
    to: string;
}

interface IOnAccepted {
    ids: string[];
}

export class CallHandler {

    private io: any;
    private socket: any;
    private userService?: UserService;
    private redis?: Redis;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    public setupConnection(io: any, socket: Socket, redis: Redis): CallHandler {
        this.io = io;
        this.redis = redis;
        this.socket = socket;
        return this;
    }

    public init() {
        this.socket.on('OFFER', async (args: IOnOffer) => {
            const id = args.to;
            const socketId = await this.redis!.get(id);
            console.info(socketId,args, 555)

            if (socketId)  {
                const user = await this.userService!.getById(args.from);
                this.socket.to(socketId).emit('OFFER', { user })
            }

            console.log(this.io.sockets.adapter.rooms)

        });

        this.socket.on('ACCEPTED', async(args: IOnAccepted) => {
            args.ids.map(async (id) => {
                const socketId = await this.redis!.get(id);
                this.socket.to(socketId).emit('ACCEPTED');
            })
        })
    }

    private async getInterlocutors(authId: string) {
        return  this.userService!.getInterlocutors(authId);
    }
}
