import { IsEmail, IsString } from "class-validator";

export class RegisterValidator {
    @IsEmail()
    email!: string;

    @IsString()
    password!: string

    @IsString()
    username!: string
}