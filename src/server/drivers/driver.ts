import { Express } from 'express';
import * as Koa from 'koa';

export interface Driver<T extends Express | Koa> {
    setupStandardMiddlewares: (server: T) => void;

    kill: () => void;

    setup: (controllers: any[], port: number) => Promise<T>;
}
