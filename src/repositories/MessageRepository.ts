import { EntityRepository } from 'typeorm';
import { Message } from '../entities/message/Message';
import { Service } from 'typedi';
import { Repository } from './BaseRepository';

@Service()
@EntityRepository(Message)
export class MessageRepository extends Repository<Message> {}
