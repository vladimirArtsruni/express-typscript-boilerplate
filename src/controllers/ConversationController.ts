import { JsonController, Get, Authorized, Param, Req, Post, Body } from 'routing-controllers';
import { ConversationService } from '../services/ConversationService';
import { ConversationDto } from '../dto/chat/ConversationDto'
import { MessageDto } from '../dto/chat/MessageDto'
import { Service } from 'typedi';
import { Request } from 'express';

@Service()
@JsonController('/conversations')

export class ConversationController {

    constructor(private conversationService: ConversationService) {}

    @Post('/')
    @Authorized()
    async create(@Req() req: Request,  @Body() body: ConversationDto) {
        return this.conversationService.create(req.user.id, body);
    }

    @Get('/:id')
    @Authorized()
    async findOne(@Param("id") id: string) {
        return this.conversationService.getById(id);
    }

    @Get('/:id/messages')
    @Authorized()
    async getMessages(@Param("id") conversationId: string, @Req() req: Request) {
        return this.conversationService.getMessages(conversationId, req.user.id);
    }

    @Get('/:id/messages')
    @Authorized()
    async createMessage(@Param("id") conversationId: string, @Req() req: Request, @Body() body: MessageDto) {
        return this.conversationService.createMessage(conversationId, req.user.id, body);
    }
}

