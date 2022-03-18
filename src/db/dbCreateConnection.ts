import { Connection, createConnection } from 'typeorm';

import { Environment } from '../config/Environment'

export const dbCreateConnection = async (): Promise<Connection | null> => {
    try {
        const conn = await createConnection(Environment.getOrmPostgreConfig());
        console.log(`Database connection success. Connection name: '${conn.name}' Database: '${conn.options.database}'`);
    } catch (err) {
        console.log(err);
    }
    return null;
};
