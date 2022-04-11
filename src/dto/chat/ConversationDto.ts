import { IsUUID, ValidateNested } from 'class-validator';
import { MessageDto } from './MessageDto';

export class ConversationDto {
    @IsUUID(4)
    userId!: string;

    @ValidateNested()
    message!: MessageDto
}
