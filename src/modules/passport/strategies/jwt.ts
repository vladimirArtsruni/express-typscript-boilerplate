import { Environment } from '../../../config/Environment'
import { Strategy, ExtractJwt } from "passport-jwt";
import { Request } from 'express';


export class JwtStrategy {
    public static init(_passport: any): void {
        _passport.use(new Strategy(
            {
                secretOrKey: Environment.getAccessTokenSecret(),
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                passReqToCallback: true
            }, async (payload, done) => {
                console.log(payload, 123)
                //  const user = await request.services.userService.getById(payload.userId);
                // // if (!user) {
                // //     return done(null, false, {message: 'User is not found'});
                // // }
                // //
                return done(null, {user: 1});
            }));
    }
}

