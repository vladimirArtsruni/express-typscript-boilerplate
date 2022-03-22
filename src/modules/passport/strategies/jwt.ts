import { Environment } from '../../../config/Environment'
import { Strategy, ExtractJwt } from "passport-jwt";

export default new Strategy(
    {
        secretOrKey: Environment.getAccessTokenSecret(),
        jwtFromRequest: ExtractJwt.fromAuthHeader(),
        passReqToCallback: true
    }, async (payload, done) => {
        // const user = await DB.models.User.findByPk(payload.userId);
        // if (!user) {
        //     return done(null, false, {message: 'User is not found'});
        // }
        //
        // return done(null, user, { message: 'Welcome' });
    });
