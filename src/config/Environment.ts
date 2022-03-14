import * as  path from 'path'
import * as envConfigs from 'dotenv';

envConfigs.config({ path: path.resolve(__dirname, '../../.env') });

export class Environment {
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

}
