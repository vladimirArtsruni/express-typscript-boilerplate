import * as  path from 'path'
import * as envConfigs from 'dotenv';
import { ConnectionOptions } from 'typeorm';

envConfigs.config({ path: path.resolve(__dirname, '../../.env') });

export class Environment {

    public static readonly Port = process.env.PORT || 8002 ;

    public static readonly BcryptGenSaltRountds = 10;

    public static readonly BearerTokenPrefix = 'Bearer';
    public static readonly TokenSecret = process.env.TOKEN_SECRET || 'TOKEN_SECRET';
    public static readonly AccessTokenLife = process.env.ACCESS_TOKEN_LIFE || '3000m';
    public static readonly VerifyTokenLife = process.env.VERIFY_TOKEN_LIFE || '30d';
    public static readonly RefreshTokenLife = process.env.REFRESH_TOKEN_LIFE || '30d';
    public static readonly ForgotPasswordTokenLife = process.env.FORGOT_PASSWORD_TOKEN_LIFE || '30d';

    public static gerMailerConfig() {
        return {
            apiKey: process.env.SENDGRID_API_KEY!,
            sender: process.env.SENDGRID_SENDER_EMAIL || 'dev+1@brainstormtech.io'
        }
    };

    public static getOrmPostgresConfig(): ConnectionOptions {
        return {
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            // port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            schema: process.env.POSTGRES_SCHEMA,
            synchronize: false,
            logging: false,
            entities: [ 'src/entities/**/*.ts' ],
            migrations: [
                'src/db/migrations/**/*.ts'
            ],
            cli: {
                entitiesDir: 'src/entities/**/*.ts',
                migrationsDir: 'src/db/migrations'
            }
        }
    }
}
