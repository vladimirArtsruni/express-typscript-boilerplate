import { IsEmail, IsString } from "class-validator";

export class LoginValidator {
    @IsEmail()
    email!: string;
    
    @IsString()
    password!: string
}