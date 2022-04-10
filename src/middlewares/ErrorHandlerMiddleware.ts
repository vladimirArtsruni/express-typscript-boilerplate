import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';
import { Request, Response } from 'express';
import { ValidationError } from 'class-validator';
import { Exception } from '../modules/exception/Exception';
import { ErrorCode } from '../modules/exception/ErrorCode';

@Middleware({ type: 'after' })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
    error(error: any, request: Request, response: Response, next: (err: any) => any) {
        if ( Array.isArray(error.errors) && error.errors.every((element: any) => element instanceof ValidationError)){
            let responseObject = [] as any;
            error.errors.forEach((element: ValidationError) => {
                responseObject.push({
                    constraints: element.constraints,
                    property: element.property,
                });
            });
            response.status(400).send(new Exception(ErrorCode.ValidationError, responseObject));
        }else {
            if (error instanceof Exception) {
                response.status(error.httpCode).send(error);
            }else {
                console.error(error,'error')
                response.status(500).send({ code: ErrorCode.UnknownError, errors: error });
            }
        }
    }
}
