import 'reflect-metadata';
import * as express from 'express';
import { Express } from 'express';
import { Server } from 'http';
import * as bodyParser from 'body-parser';
import { useExpressServer } from 'routing-controllers';
import { Controller } from 'routing-controllers';
import { addServicesToRequest } from '../middlewares/ServiceDependenciesMiddleware';
import { RequestServices } from '../types/CustomRequest'

export class ExpressServer {

    private server?: Express;
    private httpServer?: Server;
    constructor(private controllers: any[], private requestServices: RequestServices) {}

    /**
     * @param controllers
     * @param port
     */
    public async setup(port: number): Promise<Express> {
        const server = express();

        this.setupStandardMiddlewares(server);
        this.setupServiceDependencies(server);
        this.configureApiEndpoints(server);
        this.httpServer = this.listen(server, port);
        this.server = server;

        return this.server;
    }

    /**
     * @param server
     * @param port
     */
    public listen(server: Express, port: number) {
        console.info(`Starting server on port ${port}`);
        return server.listen(port);
    }

    /**
     * @param server
     */
    setupStandardMiddlewares(server: Express): void {
        server.use(bodyParser.json());
        server.use(bodyParser.urlencoded({ extended: true }));
    }

    public kill(): void {
        if (this.httpServer) this.httpServer.close();
    }

    /**
     * @param server
     * @param controllers
     */
    async configureApiEndpoints (server: Express): Promise<void> {
        useExpressServer(server, {
            routePrefix: '/api',
            controllers: [ ...this.controllers ]
        });
    }

    /**
     * @param server
     * @private
     */
    private setupServiceDependencies(server: Express) {
        const servicesMiddleware = addServicesToRequest(this.requestServices)
        server.use(servicesMiddleware)
    }
}
