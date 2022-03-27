import * as  bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Environment } from '../../config/Environment';
import { Entity, PrimaryColumn, Column, CreateDateColumn,PrimaryGeneratedColumn } from 'typeorm';
import { Roles } from './types';

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

    /**
     * @param password
     */
    public async checkPassword(password: string): Promise<boolean> {
       return bcrypt.compareSync(password, this.password );
    }

    public generateToken() {
       return jwt.sign({ data: { id: this.id } }, Environment.getAccessTokenSecret(), { expiresIn: Environment.getAccessTokenLife()});
    }
}
