import * as  bcrypt from 'bcryptjs';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Types } from './types';
import { Crypto } from '../../modules/crypto';

@Entity('Token')
export class Token {
    @PrimaryGeneratedColumn()
    id!: string;

    @Column()
    userId!: string;

    @Column({
        default: 'refresh' as Types
    })
    type!: string;

    @Column()
    token!: string;

    @Column()
    @CreateDateColumn()
    createdAt!: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt!: Date;
}
