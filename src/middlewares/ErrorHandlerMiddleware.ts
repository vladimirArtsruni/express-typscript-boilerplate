import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';
import { Request, Response } from 'express';
import { ValidationError } from 'class-validator';
import { Exception } from '../modules/exception/Exception';
import { ErrorCode } from '../modules/exception/ErrorCode';

@Middleware({ type: 'after' })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
    error(error: any, request: Request, response: Response, next: (err: any) => any) {

        if (error instanceof Exception) {
            response.status(error.status).send(error);
        }else if (error instanceof ValidationError) {
            response.status(402).send({ errors: error });
        }else {
            response.status(500).send({ code: ErrorCode.UnknownError, errors: error });
        }
    }
}