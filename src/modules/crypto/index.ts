import * as crypto from 'crypto';


export class Crypto {

    /**
     * @private
     */
    private static readonly hashIterations = 10;

    /**
     * @private
     */
    private static readonly hashLength = 128;
    /**
     * @private
     */
    private static readonly keylen =  'sha512';

    /**
     * @param password
     * @param salt
     */
    public static async generatePassword(password: string, salt: string): Promise<string>{
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(
                password,
                salt,
                this.hashIterations,
                this.hashLength,
                this.keylen,
                (err, key) => {
                    if (err) return reject(err);
                    return resolve(key.toString('hex'));
                }
            );
        });
    }

    /**
     * @param password
     * @param salt
     * @param exepctedPassword
     */
    public static async validatePassword(password: string, salt: string, exepctedPassword: string): Promise<boolean> {

        const hash = await this.generatePassword(password, salt);
        return hash === exepctedPassword;
    }

}