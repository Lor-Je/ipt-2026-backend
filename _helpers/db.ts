// Force @vercel/node to include mysql2 in the serverless bundle.
// Sequelize loads it dynamically based on `dialect: 'mysql'`, so without
// this static import Vercel's file tracer leaves it out → runtime error.
import 'mysql2';

import mysql from 'mysql2/promise';
import { Sequelize } from 'sequelize';
import accountModel from '../accounts/account.model';
import refreshTokenModel from '../accounts/refresh-token.model';

const db: any = {};
export default db;

type FileConfig = {
    database?: {
        host?: string;
        port?: number;
        user?: string;
        password?: string;
        database?: string;
    };
};

function loadFileConfig(): FileConfig {
    try {
        return require('../config.json');
    } catch {
        return {};
    }
}

function getDatabaseConfig() {
    const fileConfig: FileConfig = process.env.NODE_ENV === 'production' ? {} : loadFileConfig();
    const databaseConfig = fileConfig.database || {};

    const host = process.env.DB_HOST || databaseConfig.host || 'localhost';
    const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : (databaseConfig.port || 3306);
    const user = process.env.DB_USER || databaseConfig.user || 'root';
    const password = process.env.DB_PASSWORD || databaseConfig.password || '';
    const database = process.env.DB_NAME || databaseConfig.database || 'node_mysql_api';
    const ssl = process.env.DB_SSL === 'true';

    return { host, port, user, password, database, ssl };
}

async function initialize() {
    const { host, port, user, password, database, ssl } = getDatabaseConfig();

    // Only auto-create DB in local/non-production environments
    if (process.env.NODE_ENV !== 'production' && host === 'localhost') {
        const connection = await mysql.createConnection({ host, port, user, password });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
        await connection.end();
    }

    const sequelize = new Sequelize(database, user, password, {
        host,
        port,
        dialect: 'mysql',
        dialectOptions: ssl ? { ssl: { rejectUnauthorized: false } } : undefined,
        logging: false,
        pool: {
            // Serverless-friendly pool settings (small pool, quick eviction)
            max: 2,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    });

    // Init models
    db.Account = accountModel(sequelize);
    db.RefreshToken = refreshTokenModel(sequelize);

    // Define relationships
    db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
    db.RefreshToken.belongsTo(db.Account);

    // Sync models with database
    await sequelize.sync();
}

// Cache the init promise so we don't reconnect on every serverless invocation,
// and so that incoming requests can await it before touching the models.
db.ready = initialize().catch((err: any) => {
    console.error('DB initialization failed:', err);
    throw err;
});