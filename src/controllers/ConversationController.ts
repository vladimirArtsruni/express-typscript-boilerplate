import { JsonController, Get, Authorized, Param, Req, Post, Body, QueryParam } from 'routing-controllers';
import { ConversationService } from '../services/ConversationService';
import { UserService } from '../services/UserService';
import { ConversationDto } from '../dto/chat/ConversationDto'
import { MessageDto } from '../dto/chat/MessageDto'
import { Service } from 'typedi';
import { Request } from 'express';

@Service()
@JsonController('/conversations')

export class ConversationController {

    constructor(private conversationService: ConversationService,private userService: UserService) {}

    @Post('/')
    @Authorized()
    async create(@Req() req: Request,  @Body() body: ConversationDto) {
        return this.conversationService.create(req.user.id, body);
    }

    @Get('/:id')
    @Authorized()
    async findOne(@Param('id') id: string) {
        return this.conversationService.getById(id);
    }

    @Get('/:id/messages')
    @Authorized()
    async getMessages(@Param('id') conversationId: string) {
        return this.conversationService.getMessages(conversationId);
    }

    @Post('/:id/messages')
    @Authorized()
    async createMessage(@Param('id') conversationId: string, @Req() req: Request, @Body() body: MessageDto) {
        return this.conversationService.createMessage(conversationId, req.user.id, body);
    }

    @Get('/interlocutors/search')
    @Authorized()
    async searchInterlocutors(@Req() req: Request,@QueryParam('key') searchKey: string) {
        return this.userService.searchInterlocutors(req.user.id, searchKey);
    }
}

