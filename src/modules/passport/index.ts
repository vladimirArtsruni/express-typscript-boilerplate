import * as jwt from 'jsonwebtoken';
import * as passport from 'passport';
import { Strategy, ExtractJwt } from "passport-jwt";
import { JwtStrategy } from './strategies/jwt';
import { LocalStragey } from './strategies/local';
import { User } from '../../entities/users/User';
import { Environment } from '../../config/Environment';
import { Request, Response } from 'express';
import { Express } from 'express';
import { ErrorCode } from '../../exception/ErrorCode';
import { ErrorMessages } from '../../exception/ErrorMessages';
import { ErrorException } from '../../exception/ErrorException';

export class Passport {
    private passport: passport.PassportStatic;

    constructor() {
        this.passport = passport;
        this.passport.serializeUser((user: any, done: any) => {
            done(null, user.id);
        });

        this.passport.deserializeUser(async (id: any, done: any) => {

            done(null, id);
        });

        this.mountStrategies(this.passport);
    }

    /**
     * @param request
     */
    public async login(request: Request) {
        return new Promise((resolve, reject) => {
            this.passport.authenticate('local', { session: false }, async (err, user: User | null, messages: { [key: string]: string }) => {
                if (err) reject(new ErrorException(ErrorCode.UnknownError));
                if (!user) reject(new ErrorException(ErrorCode.Unauthenticated, messages));
                const token = this.generateToken(user!);
                resolve(token);
            })(request);
        })
    }

    /**
     * @param user
     */
    private generateToken = (user: User): Object => {
        let token = jwt.sign({ data: { id: user.id }}, Environment.getAccessTokenSecret(), { expiresIn: Environment.getAccessTokenLife() });
        return { token: token, userId: user.id };
    }

    /**
     * @param passport
     * @private
     */
    private mountStrategies(passport: passport.PassportStatic): void {
        LocalStragey.init(passport);
        JwtStrategy.init(passport);
    }
}