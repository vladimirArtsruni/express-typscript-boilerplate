import * as jwt from "jsonwebtoken";
import * as  bcrypt from "bcryptjs";
import { Environment } from "../../config/Environment";

export class Helpers {

  /**
   * @param data
   * @param isAccess
   */
  public static generateToken(data: { [key: string]: string }, isAccess = true) {
    const secret = isAccess ? Environment.getAccessTokenSecret() : Environment.getRefreshTokenSecret();
    const expiresIn = isAccess ? Environment.getAccessTokenLife() : Environment.getRefreshTokenLife();
    return jwt.sign({ data }, secret, { expiresIn });
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
  public static verifyJwt(token: string, cb: any, isAccess = true) {
    const secret = isAccess ? Environment.getAccessTokenSecret() : Environment.getRefreshTokenSecret();
    return jwt.verify(token, secret, cb);
  }

  /**
   * @param password
   * @param hashedPassword
   */
  public static checkPassword(password: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(password, hashedPassword);
  }
}
