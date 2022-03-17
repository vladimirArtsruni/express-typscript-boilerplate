import { ExpressMiddlewareInterface } from 'routing-controllers';

import { Request, Response, NextFunction, RequestHandler } from 'express'
import { RequestServices } from '../types/CustomRequest'
import { JsonController, Get, Req } from 'routing-controllers';

export const addServicesToRequest = (services: RequestServices): RequestHandler => (req: Request, res: Response, next: NextFunction) => {
    (req as any).services = services;
    next();
}
