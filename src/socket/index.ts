import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { Service } from 'typedi';
import { ConversationService } from '../services/ConversationService'
import { UserService } from '../services/UserService'
import { Helpers } from '../modules/helpers';
import { MessageHandler } from './handlers/messageHandler';
import { ProfileHandler } from './handlers/profileHandler';

@Service()
export class SocketIo {

    constructor(
        public conversationService: ConversationService,
        public userService: UserService
    ) {}

    /**
     * @param httpServer
     */
    public init(httpServer: HttpServer) {
        const io = new Server(httpServer, {
            cors: { origin: '*' }
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
    }

    /**
     * @param io
     * @private
     */
    private initHandlers(io: any) {
        const profileHandlers = new  ProfileHandler(this.userService);
        const messageHandlers = new  MessageHandler(this.conversationService);

        io.on('connection', async (socket: Socket) => {
            profileHandlers.setupConnection(io, socket).init();
            messageHandlers.setupConnection(io, socket).init();
        });
    }
}

