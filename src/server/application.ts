import { ExpressServer } from './drivers/express';
import { KoaServer } from './drivers/koa';
import Controllers from '../controllers';
import { Environment } from '../config/Environment'

/**
 * Wrapper around the Node process, ExpressServer abstraction and complex dependencies such as services that ExpressServer needs.
 * When not using Dependency Injection, can be used as place for wiring together services which are dependencies of ExpressServer.
 */
export class Application {
    public static async createApplication() {
        let server;
        if (Environment.getServerDriver() === 'EXPRESS') {
            server = new ExpressServer();
            await server.setup(Controllers, Environment.getPort());
        } else {
            server = new KoaServer();
            await server.setup(Controllers, Environment.getPort());
        }
        Application.handleExit(server);
        return server;
    }

    private static handleExit(server: ExpressServer | KoaServer) {
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

    private static shutdownProperly(exitCode: number, server: ExpressServer | KoaServer) {
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
