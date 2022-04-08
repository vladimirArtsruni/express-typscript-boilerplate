import { JsonController, Get, Authorized, Param, Req } from 'routing-controllers';
import { ConversationService } from '../services/ConversationService';
import { Service } from 'typedi';
import { Request } from 'express';

@Service()
@JsonController('/conversations')

export class ConversationController {

    constructor(private conversationService: ConversationService) {}

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
}

