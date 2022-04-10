import { Entity, Column, CreateDateColumn,PrimaryGeneratedColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToMany  } from 'typeorm';
import { User } from '../users/User';
import { Message } from '../message/Message';

@Entity('conversations')
export class Conversation {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    @CreateDateColumn()
    createdAt!: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt!: Date;



    @OneToMany(() => Message, message => message.user)
    messages!: Message[];

    @ManyToMany(() => User, user => user.conversations)
    @JoinTable({
        name: 'conversationUsers',

        joinColumn: {
            name: "conversationId",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "userId",
            referencedColumnName: "id"
        },
    })
    users!: User[];

}
