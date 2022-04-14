import "reflect-metadata";
import * as express from "express";
import * as bodyParser from "body-parser";
import { Express } from "express";
import { Server } from "http";
import { useExpressServer } from "routing-controllers";
import { Action } from "routing-controllers";
import { ErrorHandlerMiddleware } from "../middlewares/ErrorHandlerMiddleware";
import { authorizationChecker } from "../modules/decorators/AuthorizationChecker";
import { currentUserChecker } from "../modules/decorators/CurrentUserChecker";
import * as cors from 'cors';

/** CONTROLLERS **/
import { UserController } from "../controllers/UserController";
import { AuthController } from "../controllers/AuthController";
import { ConversationController } from "../controllers/ConversationController";

export class ExpressServer {

  private server?: Express;
  public httpServer!: Server;

  /**
   * @param port
   */
  public async setup(port: number): Promise<Express> {

    const server = express();
    this.setupStandardMiddlewares(server);
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
    server.use(cors({origin: '*'}));
    server.use(bodyParser.urlencoded({ extended: true }));
  }

  public kill(): void {

    if (this.httpServer) this.httpServer.close();
  }

  /**
   * @param server
   */
  async configureApiEndpoints(server: Express): Promise<void> {

    useExpressServer(server, {
      authorizationChecker: (action: Action, roles: string[]) => authorizationChecker(action, roles),
      currentUserChecker: async (action: Action) => currentUserChecker(action),
      routePrefix: "/api",
      controllers: [AuthController, UserController, ConversationController],
      middlewares: [ErrorHandlerMiddleware],
      defaultErrorHandler: false
    });
  }
}
