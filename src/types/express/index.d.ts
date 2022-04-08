import * as express from 'express';
import { User } from '../../entities/users/User';

declare global{
    namespace Express {
        interface Request {
            user: User
        }
    }
}
