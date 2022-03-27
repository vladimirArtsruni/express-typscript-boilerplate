import { JsonController, Post, Body, Authorized } from 'routing-controllers';
import { LoginDto } from '../dto/auth/LoginDto';
import { RegisterDto } from '../dto/auth/RegisterDto';
import { AuthService } from '../services/AuthService';

@JsonController('/auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/register')
    async register(@Body() body: RegisterDto) {
        return this.authService.register(body);
    }

    @Post('/login')
    async login(@Body() body: LoginDto) {
        return this.authService.login(body);
    }
}