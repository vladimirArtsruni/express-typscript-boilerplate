import {
    Entity, Column, CreateDateColumn,
    PrimaryGeneratedColumn, OneToOne, JoinColumn,
} from 'typeorm';

import { Types } from './types';
import { User } from '../users/User';

@Entity('tokens')
export class Token {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({type: 'uuid'})
    userId!: string;

    @Column()
    ip?: string;

    @Column()
    token!: string;

    @Column({
        type: 'enum',
        enum: Object.values(Types),
        default: Types.REFRESH
    })
    type!: Types;

    @Column()
    @CreateDateColumn()
    createdAt!: Date;

    @OneToOne(() => User)
    @JoinColumn()
    user!: User
}
