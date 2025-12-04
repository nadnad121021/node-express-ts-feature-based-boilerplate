import 'reflect-metadata';
import { DataSource } from 'typeorm';
import config from '@config';
import { User } from '@modules/users/user.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: config.db.database,
  synchronize: config.nodeEnv !== 'production', // ⚠️ Set false in production and use migrations
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: []
});
