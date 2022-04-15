import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { Service } from 'typedi';
import { ConversationService } from '../services/ConversationService'
import { UserService } from '../services/UserService'
import { MessageHandler } from './handlers/messageHandler';
import { ProfileHandler } from './handlers/profileHandler';
import { CallHandler } from './handlers/callHandler';
import { Helpers } from '../modules/helpers';
import { Redis } from '../redis';
import { Message } from '../entities/message/Message';
import { User } from '../entities/users/User';
import { MessageResource } from '../resources/MessageResource';

interface IOnGetInterlocutors {
    authId: string;
}

interface IOnOffer {
    from: string;
    to: string;
    room: string;
}

interface IMessage {
    text: string;
}

interface IOnAccepted {
    callerId: string;
    respondentId: string;
    room: string;

}

interface INewMessage {
    authId: string;
    conversationId?: string;
    userId?: string;
    message: IMessage;
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

        io.on('connection', async (socket: Socket) => {
            const userId = socket.handshake.query.userId;

            if (userId) {
                await redis!.set(userId as string, socket.id);
                socket.broadcast.emit('USER_ONLINE', { userId });
            }

            /************************* PROFILE *************************************************/
            socket.on('GET_INTERLOCUTORS', async (arg: IOnGetInterlocutors) => {
                const interlocutors = await this.userService!.getInterlocutors(arg.authId);
                interlocutors.map(async (interlocutor) => {
                    socket.join(interlocutor.conversation!.id);
                    const isOnline = await redis!.get(interlocutor.id);
                    if (isOnline) socket.emit('USER_ONLINE', { userId: interlocutor.id })
                });
                socket.emit('GET_INTERLOCUTORS_RESULT', interlocutors)
            });

            /************************* MESSAGE ************************************************/
            socket.on('NEW_MESSAGE', async (arg: INewMessage) => {
                const authId = arg.authId;

                let message: Message;
                if (arg.conversationId) {
                    message = await this.conversationService!.createMessage(arg.conversationId, authId, arg.message);
                } else {
                    message = await this.conversationService!.create(
                        authId, { userId: arg.userId!, message: arg.message });
                }
                message.user = await this.userService!.getById(authId) as User;
                const resource = MessageResource.message(message);
                console.log(resource, message.conversationId)
                io.sockets.in(message.conversationId).emit('NEW_MESSAGE_RESULT', resource);
            })

            /******************************** CALL *********************************************/
            socket.on('ACCEPTED', async (args: IOnAccepted) => {

                const socketId = await redis!.get(args.callerId);
                if (socketId) socket.to(socketId).emit('ACCEPTED', { userId: args.respondentId, room: args.room });

                // args.ids.map(async (id) => {
                //     const socketId = await redis!.get(id);
                //     console.log(socketId,55)
                // })
            })

            socket.on('OFFER', async (args: IOnOffer) => {
                const id = args.to;
                const socketId = await redis!.get(id);

                if (socketId) {
                    const user = await this.userService!.getById(args.from);
                    socket.to(socketId).emit('OFFER', { user, room: args.room })
                }
            });

            /***************************** RTCPeerConnection *******************/
            socket.on('CREATE_OR_JOIN', (args: { room: string }) => {
                const room = args.room;
                const count = io.sockets.adapter.rooms.get(room) ? io.sockets.adapter.rooms.get(room).size: 0;

                if (count === 0) {
                    socket.join(room);
                    socket.emit('CREATED', room);
                }else if (count === 1){
                    socket.join(room);
                    socket.emit('JOINED', room);
                }
            });

            socket.on('READY', (args:  { room: string } ) => {
                socket.broadcast.to(args.room).emit('READY');
            })

            socket.on('OFFER_RTCP', (args:  { room: string; sdp: any } ) => {
                console.log(args, 'OFFER_RTCP')
                socket.broadcast.to(args.room).emit('OFFER_RTCP', args.sdp );
            })
            socket.on('CANDIDATE', (args:  { room: string; label: any; candidate: any } ) => {
                socket.broadcast.to(args.room).emit('CANDIDATE', {
                    label: args.label,
                    candidate: args.candidate
                } );
            })

            socket.on('ANSWER_RTCP', (args:  { room: string; sdp: any } ) => {
                socket.broadcast.to(args.room).emit('ANSWER_RTCP', args.sdp );
            })


            /********************************** DISCONNECT  **************************************/
            socket.on('disconnect', async () => {
                await redis!.delete(userId as string);
                socket.broadcast.emit('USER_OFFLINE', { userId });
            });
        });
    }
}

