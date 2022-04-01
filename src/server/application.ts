import { ExpressServer } from './server';
import { useContainer } from 'routing-controllers';
import { Container } from 'typeorm-typedi-extensions';
import { Environment } from '../config/Environment';
import { dbCreateConnection } from '../db/dbCreateConnection';

export class Application {

    public static async createApplication() {

        useContainer(Container);
        await dbCreateConnection();
        const server = new ExpressServer();
        await server.setup(Environment.Port as number);
        Application.handleExit(server);
        return server;
    }

    /**
     * @param server
     * @private
     */
    private static handleExit(server: ExpressServer) {
        process.on('uncaughtException', (err: Error) => {
            console.error('Uncaught exception', err)
            Application.shutdownProperly(1, server)
        });
        process.on('unhandledRejection', (reason: {} | null | undefined) => {
            console.error('Unhandled Rejection at promise', reason)
            Application.shutdownProperly(2, server)
        });
        process.on('SIGINT', () => {
            console.info('Caught SIGINT')
            Application.shutdownProperly(128 + 2, server)
        });
        process.on('SIGTERM', () => {
            console.info('Caught SIGTERM')
            Application.shutdownProperly(128 + 2, server)
        });
        
        process.on('exit', () => {
            console.info('Exiting')
        });
    }

    /**
     * @param exitCode
     * @param server
     * @private
     */
    private static shutdownProperly(exitCode: number, server: ExpressServer) {
        Promise.resolve()
            .then(() => server.kill())
            .then(() => {
                console.info('Shutdown complete')
                process.exit(exitCode)
            })
            .catch(err => {
                console.error('Error during shutdown', err)
                process.exit(1)
            })
    }
}
