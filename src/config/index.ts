import dotenv from 'dotenv';
import logger from '@core/utils/logger';

dotenv.config();

export type DatabaseType = 'postgres' | 'mysql' | 'mongodb';

export interface DatabaseConfig {
  type: DatabaseType;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
  url?: string;
  synchronize: boolean;
  logging: boolean;
}

export const getDatabaseConfig = (): DatabaseConfig => {
  const dbType = (process.env.DB_TYPE || 'postgres') as DatabaseType;
  const nodeEnv = process.env.NODE_ENV || 'development';
  const dbSync = process.env.DB_SYNC === 'true';
  const dbLogging = process.env.DB_LOGGING === 'true';

  const baseConfig = {
    synchronize: dbSync,
    logging: dbLogging,
  };

  // Use DATABASE_URL if provided (takes precedence)
  if (process.env.DATABASE_URL) {
    return {
      ...baseConfig,
      type: dbType,
      url: process.env.DATABASE_URL,
    };
  }

  switch (dbType) {
    case 'mysql':
      return {
        ...baseConfig,
        type: 'mysql',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306'),
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'app_db',
      };
    case 'mongodb':
      return {
        ...baseConfig,
        type: 'mongodb',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '27017'),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'app_db',
      };
    case 'postgres':
    default:
      return {
        ...baseConfig,
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'postgres',
      };
  }
};

export interface JWTConfig {
  accessSecret: string;
  refreshSecret: string;
  accessExpiresIn: string;
  refreshExpiresIn: string;
}

export interface AppConfig {
  databaseType: DatabaseType;
  port: number | string;
  nodeEnv: string;
  enableCache: boolean;
  jwt: JWTConfig;
  redis?: {
    host: string;
    port: number;
    password?: string;
  };
}

const config: AppConfig = {
  databaseType: (process.env.DB_TYPE || 'postgres') as DatabaseType,
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  enableCache: process.env.ENABLE_CACHE === 'true',
  jwt: {
    accessSecret: String(process.env.JWT_ACCESS_SECRET) || 'your_access_secret',
    refreshSecret: String(process.env.JWT_REFRESH_SECRET) || 'your_refresh_secret',
    accessExpiresIn: String(process.env.JWT_ACCESS_EXPIRES_IN) || '15m',
    refreshExpiresIn: String(process.env.JWT_REFRESH_EXPIRES_IN) || '7d',
  },
  redis:{
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
  }
};
const  dbConfig = getDatabaseConfig();
const envVariables = [
  { name: 'PORT', value: config.port },
  { name: 'NODE_ENV', value: config.nodeEnv },
  { name: 'DATABASE_TYPE', value: config.databaseType },
  { name: 'ENABLE_CACHE', value: config.enableCache },
  { name: 'DB_HOST', value: dbConfig.host || 'N/A' },
  { name: 'DATABASE_URL', value: dbConfig.url || 'N/A' },
  { name: 'DB_PORT', value: dbConfig.port || 'N/A' },
  { name: 'DB_USER', value: dbConfig.username || 'N/A' },
  { name: 'DB_NAME', value: dbConfig.database || 'N/A' },
  { name: 'JWT_ACCESS_SECRET', value: config.jwt.accessSecret },
  { name: 'JWT_REFRESH_SECRET', value: config.jwt.refreshSecret },
  { name: 'JWT_ACCESS_EXPIRES_IN', value: config.jwt.accessExpiresIn }
]
if(config.enableCache){
  envVariables.push({ name: 'REDIS_HOST', value: config.redis?.host || 'N/A' });
  envVariables.push({ name: 'REDIS_PORT', value: config.redis?.port || 'N/A' });
  envVariables.push({ name: 'REDIS_PASSWORD', value: config.redis?.password || 'N/A' });
}

logger.table(envVariables);

export default config;
