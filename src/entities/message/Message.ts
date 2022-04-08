import { Entity, Column, CreateDateColumn,PrimaryGeneratedColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { User } from '../users/User';

@Entity('messages')
export class Message {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({type: 'uuid'})
    conversationId!: string;

    @Column({type: 'uuid'})
    userId!: string;

    @Column()
    text!: string;

    @Column({type: 'jsonb'})
    attachments?: any;

    @Column({type: 'jsonb'})
    media?: any;
    
    @Column()
    @CreateDateColumn()
    createdAt!: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToOne(() => User)
    user!: User;
}
