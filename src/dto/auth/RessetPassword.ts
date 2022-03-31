import { IsString } from 'class-validator';

export class RessetPassword {
    @IsString()
    token!: string;

    @IsString()
    password!: string

    @IsString()
    confirmPassword!: string
}
