
import { getDatabaseConfig } from '../config/index';
import { User } from '@modules/users/user.entity';
import { DataSource } from 'typeorm';

const dbConfig = getDatabaseConfig();

const baseOptions = {
  synchronize: dbConfig.synchronize,
  logging: dbConfig.logging,
  entities: [User],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
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
  };
}

export const AppDataSource = new DataSource(dataSourceOptions);
