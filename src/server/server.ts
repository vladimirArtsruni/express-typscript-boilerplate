import * as express from 'express';
import { Express } from 'express';
import { Server } from 'http';
import * as compress from 'compression';
import * as helmet from 'helmet';
import * as hpp from 'hpp';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import Routes from '../routes';

/**
 * Abstraction around the raw Express.js server and Nodes' HTTP server.
 * Defines HTTP request mappings, basic as well as request-mapping-specific
 * middleware chains for application logic, config and everything else.
 */
export class ExpressServer {
    private server?: Express
    private httpServer?: Server

    public async setup(port: number) {
        const server = express()
        ExpressServer.setupStandardMiddlewares(server)
        ExpressServer.setupSecurityMiddlewares(server)
        ExpressServer.configureApiEndpoints(server)

        this.httpServer = this.listen(server, port)
        this.server = server
        return this.server
    }

    public listen(server: Express, port: number) {
        console.info(`Starting server on port ${port}`)
        return server.listen(port)
    }

    public kill() {
        if (this.httpServer) this.httpServer.close()
    }

    private static setupSecurityMiddlewares(server: Express) {
        server.use(hpp())
        server.use(helmet())
        server.use(helmet.referrerPolicy({ policy: 'same-origin' }))
        server.use(
            helmet.contentSecurityPolicy({
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'unsafe-inline'"],
                    scriptSrc: ["'unsafe-inline'", "'self'"]
                }
            })
        )
    }

    private static setupStandardMiddlewares(server: Express) {
        server.use(bodyParser.json())
        server.use(cookieParser())
        server.use(compress())
    }



    private static configureApiEndpoints(server: Express) {
        server.use('/api/', Routes);
    }
}
