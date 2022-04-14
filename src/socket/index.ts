import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { Service } from 'typedi';
import { ConversationService } from '../services/ConversationService'
import { UserService } from '../services/UserService'
import { MessageHandler } from './handlers/messageHandler';
import { ProfileHandler } from './handlers/profileHandler';
import { Helpers } from '../modules/helpers';
import { Redis } from '../redis';

interface IRedisUser {

    [key: string]: string;
}


@Service()
export class SocketIo {
    private redis?: Redis;

    constructor(
        public conversationService: ConversationService,
        public userService: UserService
    ) {
    }

    private async authMiddleware(io: any) {

        io.use((socket: Socket, next: any) => {
            const token = socket.handshake.auth.token;
            Helpers.verifyJwt(token, async (err: any, decoded: any) => {
                if (err || typeof decoded === 'undefined') return;
                const user = await this.userService.getById(decoded.data.id);
                if (!user) return;
                // socket.data.user  = user
                next();
            })
        });
    }

    /**
     * @param httpServer
     * @param redis
     */
    public init(httpServer: HttpServer, redis: Redis) {

        this.redis = redis;
        const io = new Server(httpServer, {
            cors: { origin: '*' }
        });
        this.authMiddleware(io).then(() => {
            this.initHandlers(io, redis);
        });
    }

    /**
     * @param io
     * @param redis
     * @private
     */
    private initHandlers(io: any, redis: Redis) {

        const profileHandlers = new ProfileHandler(this.userService);
        const messageHandlers = new MessageHandler(this.conversationService, this.userService);

        io.on('connection', async (socket: Socket) => {
            const userId = socket.handshake.query.userId;

            if (userId) {
                await this.redis!.set(userId as string, socket.id);
                socket.broadcast.emit('USER_ONLINE', { userId });
            }

            profileHandlers.setupConnection(io, socket, redis).init();
            messageHandlers.setupConnection(io, socket, redis).init();

            socket.on('disconnect', async () => {
                await this.redis!.delete(userId as string);
                socket.broadcast.emit('USER_OFFLINE', { userId });
            });


            socket.on('ACCEPTED', async(args) => {
                console.info(args,78)
                socket.to(args.to).emit('ACCEPTED', args.sdp)

            })

            socket.on('OFFER',  async (args) => {
              const id = args.to;
              const socketId = await redis.get(id);

                if (socketId) {
                  socket.to(socketId).emit('OFFER', args)
              }

            });
        });
    }
}

