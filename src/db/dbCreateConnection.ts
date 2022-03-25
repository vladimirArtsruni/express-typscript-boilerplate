import { Connection, createConnection, useContainer } from 'typeorm';
import { Controller } from 'routing-controllers';
import { Container } from 'typeorm-typedi-extensions';

import { Environment } from '../config/Environment'

export const dbCreateConnection = async (): Promise<Connection | null> => {
    try {
        useContainer(Container);
        const conn = await createConnection(Environment.getOrmPostgreConfig());
        console.log(`Database connection success. Connection name: '${conn.name}' Database: '${conn.options.database}'`);
        return conn;
    } catch (err) {
        console.log(err);
    }
    return null;
};
