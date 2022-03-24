import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';
import { Request, Response } from 'express';
import { Exception } from '../modules/exception/Exception';
import { ErrorCode } from '../modules/exception/ErrorCode';

@Middleware({ type: 'after' })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
    error(error: any, request: Request, response: Response, next: (err: any) => any) {
        if (error instanceof Exception) {
            response.status(error.status).send(error);
        } else {
            response.status(500).send({ code: ErrorCode.UnknownError, status: 500 });
        }
    }
}