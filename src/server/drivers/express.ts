import 'reflect-metadata';
import * as express from 'express';
import { Express } from 'express';
import { Server } from 'http';
import * as bodyParser from 'body-parser';
import { useExpressServer } from 'routing-controllers';
import { Driver } from './driver'

export class ExpressServer implements Driver<Express> {

    private server?: Express;
    private httpServer?: Server;
    private readonly configureApiEndpoints: (server: Express, controllers: any[]) => void;

    constructor() {
        this.configureApiEndpoints = function (server: Express, controllers: any[]) {
            useExpressServer(server, {
                routePrefix: '/api',
                controllers: [ ...controllers ]
            });
        }
    }

    /**
     * @param controllers
     * @param port
     */
    public async setup(controllers: any[], port: number) {
        const server = express();

        this.setupStandardMiddlewares(server);
        this.configureApiEndpoints(server, controllers);
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
    setupStandardMiddlewares(server: Express) {
        server.use(bodyParser.json());
        server.use(bodyParser.urlencoded({ extended: true }));
    }

    public kill() {
        if (this.httpServer) this.httpServer.close();
    }

}
