import * as  bcrypt from 'bcryptjs';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

import { Role } from './types';

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


    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
    }

    checkIfPasswordMatch(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }
}
