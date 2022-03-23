import { Request } from 'express';
import { LoginValidator } from '../validation/LoginValidator';
import { Passport } from '../modules/passport';

export class AuthService {
     constructor(private passport: Passport) {};

    async login(request: Request){
        return  await this.passport.login(request);
    }
}