import { ErrorException } from './ErrorException';
import { ErrorModel } from './ErrorModel';
import { ErrorCode } from './ErrorCode';
import { Request, Response, NextFunction } from 'express';

export class ErrorHandler {

    public static initialize(err: Error, req: Request, res: Response, next: NextFunction) {
        console.log(err,1111111111);

        if (err instanceof ErrorException) {
            console.log('Error is known.');
            res.status(err.status ?? 403).send(err);
        } else {
            // For unhandled errors.
            res.status(500).send({ code: ErrorCode.UnknownError, status: 500 } as ErrorModel);
        }
    }
}