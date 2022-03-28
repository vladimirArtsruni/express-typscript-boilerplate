import { Entity, Column, CreateDateColumn,PrimaryGeneratedColumn } from 'typeorm';
import { Roles } from './types';
import { Helpers } from '../../modules/helpers';

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
       return Helpers.checkPassword(password, this.password);
    }

}
