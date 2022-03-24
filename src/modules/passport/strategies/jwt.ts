import { Environment } from '../../../config/Environment'
import { Strategy, ExtractJwt } from "passport-jwt";
import { Request } from 'express';
import { ErrorMessages } from '../../../modules/exception/ErrorMessages'

export class JwtStrategy {
    public static init(_passport: any): void {
        _passport.use(new Strategy(
            {
                secretOrKey: Environment.getAccessTokenSecret(),
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                passReqToCallback: true
            },async (request: Request, payload: any, done: any) => {
                const user = await request.services.userService.getById(payload.data.id);
                if (!user) return done(null, false, { message: ErrorMessages.UserNotFoud });
                return done(null, user);
            }));
    }
}

