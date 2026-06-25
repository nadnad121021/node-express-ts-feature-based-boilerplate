
import { getDatabaseConfig } from '../config/index';
import { User } from '@modules/users/user.entity';
import { DataSource } from 'typeorm';
import { Client } from 'pg';

const dbConfig = getDatabaseConfig();
const nodeEnv = dbConfig.nodeEnv;

const baseOptions = {
  synchronize: dbConfig.synchronize,
  logging: dbConfig.logging,
  entities: [User],
   migrations: nodeEnv === 'development'
    ? ['src/db/migrations/**/*.ts']
    : ['dist/db/migrations/**/*.js'],
  subscribers: nodeEnv === 'development'
    ? ['src/db/subscribers/**/*.ts']
    : ['dist/db/subscribers/**/*.js'],
};

let dataSourceOptions: any = {};
if (dbConfig.type === 'mongodb') {
  dataSourceOptions = {
    ...baseOptions,
    type: 'mongodb',
    url: dbConfig.url || `mongodb://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`,
    useUnifiedTopology: true,
  };
} else {
  dataSourceOptions = {
    ...baseOptions,
    type: dbConfig.type,
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    url: dbConfig.url,
    ssl: nodeEnv === 'production'
    ? {
        rejectUnauthorized: false,
      }
    : false,
    migrationsRun: nodeEnv === 'production', // Automatically run migrations in production
  };
}

export async function createDatabaseIfNotExists() {
  if (dbConfig.type !== 'postgres') return;

  const client = new Client({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.username,
    password: dbConfig.password,
    database: 'postgres',
  });

  await client.connect();

  const result = await client.query(
    `SELECT 1 FROM pg_database WHERE datname = $1`,
    [dbConfig.database]
  );

  if (result.rowCount === 0) {
    await client.query(`CREATE DATABASE "${dbConfig.database}"`);
    console.log(`Database "${dbConfig.database}" created`);
  }

  await client.end();
}

export const AppDataSource = new DataSource(dataSourceOptions);
