import * as express from 'express';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Exception } from '../modules/exception/Exception';
import { ErrorCode } from '../modules/exception/ErrorCode';

function validationMiddleware<T>(type: any): express.RequestHandler {
    return (req, res, next) => {
        validate(plainToClass(type, req.body))
            .then((errors: ValidationError[]) => {
                if (errors.length > 0) {
                    // @ts-ignore
                    const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');
                    next(new Exception(ErrorCode.BadRequestError, message));
                } else {
                    next();
                }
            });
    };
}

export default validationMiddleware;