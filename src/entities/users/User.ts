import { Entity, Column, CreateDateColumn,PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Roles } from './types';
import { Helpers } from '../../modules/helpers';
import { Conversation } from '../conversation/Conversation';

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ unique: true })
    email!: string;

    @Column({ unique: true })
    username!: string;

    @Column()
    password!: string;

    @Column()
    salt!: string;

    @Column()
    avatar!: string;

    @Column()
    isVerified!: boolean;

    @Column({
        type: 'enum',
        enum: Object.values(Roles),
        default: Roles.USER
    })
    role!: Roles;

    @Column()
    @CreateDateColumn()
    createdAt!: Date;


    @ManyToMany(() => Conversation)
    @JoinTable({
        name: 'conversationUsers',
        joinColumn: {
            name: "userId",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "conversationId",
            referencedColumnName: "id"
        }
    })
    conversations!: Conversation[] 

    /**
     * @param password
     */
    public async checkPassword(password: string): Promise<boolean> {
       return Helpers.checkPassword(password, this.password);
    }

}
