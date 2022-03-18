import { ExpressServer } from './server';
import { Controller } from 'routing-controllers';
import { UserRepository } from '../repositories/UserRepository';
import { UserService } from '../services/UserService';
import { Environment } from '../config/Environment';
import { dbCreateConnection } from '../db/dbCreateConnection';
import { UserController } from '../controllers/UserController';
import {getCustomRepository} from "typeorm";

export class Application {

    public static async createApplication() {
        await dbCreateConnection();

        const useRepository = getCustomRepository(UserRepository);
        const userService = new UserService(useRepository);

        const server = new ExpressServer([UserController], { userService });
        await server.setup(Environment.getPort());
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
