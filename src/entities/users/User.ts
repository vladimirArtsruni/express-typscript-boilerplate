import * as  bcrypt from 'bcryptjs';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Role } from './types';
import { Crypto } from '../../modules/crypto';

@Entity('User')
export class User {
    @PrimaryGeneratedColumn()
    id!: string;

    @Column({
        unique: true,
    })
    email!: string;

    @Column()
    password!: string;

    @Column()
    salt!: string;

    @Column({
        nullable: true,
        unique: true,
    })
    username!: string;

    @Column({
        default: 'user' as Role,
        length: 30,
    })
    role!: string;

    @Column()
    @CreateDateColumn()
    createdAt!: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt!: Date;


    /**
     * @param unencryptedPassword
     */
    async checkIfPasswordMatch(unencryptedPassword: string): Promise<boolean> {
        return await Crypto.validatePassword(unencryptedPassword, this.salt, this.password)
    }
}
