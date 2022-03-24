import { Strategy } from 'passport-local';
import { Request } from 'express';
import { User } from '../../../entities/users/User'
import { ErrorMessages } from '../../../modules/exception/ErrorMessages';

export class LocalStragey {
    public static init(passport: any): void {
        passport.use('local', new Strategy(
                {
                    usernameField: 'email',
                    passwordField: 'password',
                    passReqToCallback: true,
                },
                async (request: Request, email: string, password: string, done) => {
                    
                    const user = await request.services.userService.getByEmail(email);
                    if (!user) return done(null, false, { message: ErrorMessages.UserNotFoud });

                    const isValidPassword = await user.checkIfPasswordMatch(password);
                    if (!isValidPassword) return done(null, false, { message: ErrorMessages.InvalidCredentials });

                    return done(null, user);
                }
            )
        )
    }
}

