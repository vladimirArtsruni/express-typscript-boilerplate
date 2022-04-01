import * as jwt from "jsonwebtoken";
import * as  bcrypt from "bcryptjs";
import {Environment} from "../../config/Environment";
import { Types } from '../../entities/tokens/types';

export class Helpers {

    /**
     * @param data
     * @param isAccess
     */
    public static generateToken(data: { [key: string]: string }, tokenType: Types) {
        let expiresIn: string;

        switch (tokenType) {
            case Types.REFRESH:
                expiresIn = Environment.RefreshTokenLife;
                break;
            case Types.FORGOT_PASSWORD:
                expiresIn = Environment.ForgotPasswordTokenLife;
                break;
            case Types.ACCESS:
                expiresIn = Environment.AccessTokenLife;
                break;
            default:
                expiresIn = Environment.VerifyTokenLife;
        }

        return jwt.sign({data}, Environment.TokenSecret, { expiresIn });
    }

    public static generateSalt(): string {
        return bcrypt.genSaltSync(Environment.BcryptGenSaltRountds);
    }

    /**
     * @param password
     */
    public static getnerateHash(password: string) {
        const salt = this.generateSalt();
        const hashPassword = bcrypt.hashSync(password, salt);
        return {
            password: hashPassword,
            salt
        };
    }

    /**
     * @param token
     * @param cb
     * @param isAccess
     */
    public static verifyJwt(token: string, cb: any) {
        return jwt.verify(token, Environment.TokenSecret, cb);
    }

    /**
     * @param password
     * @param hashedPassword
     */
    public static checkPassword(password: string, hashedPassword: string): boolean {
        return bcrypt.compareSync(password, hashedPassword);
    }
}
