import 'reflect-metadata';
import * as Koa from 'koa';
import { Server } from 'http';
import { useKoaServer } from 'routing-controllers';
import * as bodyParser from 'koa-bodyparser';
import { Driver } from './driver'

export class KoaServer implements Driver<Koa> {
    private server?: Koa;
    private httpServer?: Server;
    private readonly configureApiEndpoints: (server: Koa, controllers: any[]) => void;

    constructor() {
        this.configureApiEndpoints = function (server: Koa, controllers: any[]) {
            useKoaServer(server, {
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
        const server = new Koa();

        this.configureApiEndpoints(server, controllers);

        this.httpServer = this.listen(server, port);
        this.server = server;

        return this.server;
    }

    /**
     * @param server
     * @param port
     */
    public listen(server: Koa, port: number) {
        console.info(`Starting server on port ${port}`);
        return server.listen(port);
    }

    public kill() {
        if (this.httpServer) this.httpServer.close();
    }

    setupStandardMiddlewares(server: Koa): void {
        server.use(bodyParser())
    }

}
