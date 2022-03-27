import * as  path from 'path'
import * as envConfigs from 'dotenv';
import { ConnectionOptions } from 'typeorm';

envConfigs.config({ path: path.resolve(__dirname, '../../.env') });

export class Environment {

    public static readonly BcryptGenSaltRountds = 10;
    public static readonly BearerTokenPrefix = 'Bearer';

    public static isLocal(): boolean {
        return Environment.getStage() === 'local'
    }

    public static isStaging(): boolean {
        return Environment.getStage() === 'staging'
    }

    public static isProd(): boolean {
        return Environment.getStage() === 'prod'
    }

    public static getStage(): string {
        return process.env.STAGE || 'local'
    }

    public static getPort(): number {
        return (process.env.PORT as any) || 8002
    }

    public static getVerticalName() {
        return process.env.VERTICAL_NAME || 'cats'
    }

    public static getServerDriver(): string {
        return process.env.SERVER_DRIVER || 'KOA'
    }

    public static getAccessTokenSecret(): string {
        return process.env.ACCESS_TOKEN_SECRET || 'ACCESS_TOKEN_SECRET'
    }
    public static getAccessTokenLife(): string {
        return process.env.ACCESS_TOKEN_LIFE || '3000m'
    }

    public static  cryptoConfig()  {
       return {
           hash: {
               length: 128,
               iterations: 10
           }
       }
    };

    public static getOrmPostgreConfig(): ConnectionOptions {
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
            entities: ['src/entities/**/*.ts'],
            migrations: [
                "src/db/migrations/**/*.ts"
            ],
            cli: {
                entitiesDir: 'src/entities/**/*.ts',
                migrationsDir: 'src/db/migrations'
            }
        }
    }
}
