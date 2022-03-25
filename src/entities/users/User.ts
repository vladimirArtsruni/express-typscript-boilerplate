import * as  bcrypt from 'bcryptjs';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Crypto } from '../../modules/crypto';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id!: string;

    @Column({
        unique: true,
    })
    email!: string;

    @Column({
        unique: true,
    })
    username!: string;

    @Column()
    password!: string;

    @Column()
    salt!: string;


    @Column()
    @CreateDateColumn()
    createdAt!: Date;

    /**
     * @param unencryptedPassword
     */
    async checkIfPasswordMatch(unencryptedPassword: string): Promise<boolean> {
        return await Crypto.validatePassword(unencryptedPassword, this.salt, this.password)
    }
}
