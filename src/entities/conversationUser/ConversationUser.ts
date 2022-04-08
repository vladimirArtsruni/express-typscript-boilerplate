import { Entity, Column, CreateDateColumn,PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('conversationUsers')
export class ConversationUser {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'uuid' })
    conversationId!: string;

    @Column({type: 'uuid'})
    userId!: string;

    @Column()
    @CreateDateColumn()
    createdAt!: Date;

    @Column()
    @UpdateDateColumn()
    updateddAt!: Date;
}
