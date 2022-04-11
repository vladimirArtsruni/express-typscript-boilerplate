import * as socketio from "socket.io";
import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import {Service} from "typedi";
import { ConversationService } from '../services/ConversationService'
import { UserService } from '../services/UserService'
import { Helpers } from '../modules/helpers';

@Service()
export class SocketIo {

    private io: any;

    constructor(
        public conversationService: ConversationService,
        public userService: UserService
    ) {}

    public setUp(httpServer: HttpServer) {
        const io = new Server(httpServer, {
            cors: { origin: "*" }
        });
        io.use((socket, next) => {
            const token = socket.handshake.auth.token;
            Helpers.verifyJwt(token,async (err: any, decoded: any)=> {
                if (err || typeof decoded === 'undefined') return;

                const user = await this.userService.getById(decoded.data.id);
                if (!user) return;
                socket.data.user  = user
                next();
            })
        });
       this.initHandlers(io);
       this.io = io;
    }

    private initHandlers(io: any) {
        const _this = this;
        io.on("connection", (socket: Socket) => {
            socket.on('NEW_MESSAGE', (arg) => this.newMessageHandlers.call(_this, arg, socket.data.user.id))
            socket.on('GET_INTERLOCUTORS', () => this.getInterlocutors.call(_this, socket))
        });
    }

    private async newMessageHandlers(arg: any, userId: string) {
        console.log(arg, 'newMessage')
        if (arg.conversationId) {
            const message = await this.conversationService.createMessage(arg.conversationId, userId, arg.message);
        }
    }

    private async getInterlocutors(socket: Socket) {
        const userId = socket.data.user.id;
        console.log(userId,'userId')
        const interlocutors = await this.userService.getInterlocutors(userId);
        socket.emit('GET_INTERLOCUTORS_RESULT', interlocutors)
    }
}


