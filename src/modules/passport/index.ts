import * as jwt from 'jwt-simple';
import * as passport from 'passport';
import { Strategy, ExtractJwt } from "passport-jwt";
import  JwtStrategy  from './strategies/jwt'
import { User } from '../../entities/users/User'
import { Environment } from '../../config/Environment'
import * as moment from "moment";
import { Request, Response } from 'express';

export class Passport {

    public initialize = () => {
        passport.use('jwt', this.getStrategy());
        return passport.initialize();
    }

    public test(){
        console.info(444)
    }
    /**
     * @param callback
     */
    public authenticate = (callback: any) => passport.authenticate('jwt', { session: false, failWithError: true }, callback);

    /**
     * @param request
     */
    public login = async (request: Request) => {
       
        let user = await  request.services.userService.getByEmail(request.body.email) as User;
        if (user === null) throw "User not found";
        let success = await user.checkIfPasswordMatch(request.body.password);
        if (success === false) throw "";
        return user;
    }

    /**
     * @param user
     */
    private genToken = (user: User): Object => {
        let expires = moment().utc().add({ days: 7 }).unix();
        let token = jwt.encode({
            exp: expires,
            username: user.username
        }, Environment.getAccessTokenSecret());

        return {
            token: token,
            expires: moment.unix(expires).format(),
            userId: user.id
        };
    }


    private getStrategy = (): Strategy => JwtStrategy
}