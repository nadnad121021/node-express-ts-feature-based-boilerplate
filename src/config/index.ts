import dotenv from 'dotenv';
import logger from '@core/utils/logger';

dotenv.config();

interface DBConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

interface JWTConfig {
  accessSecret: string;
  refreshSecret: string;
  accessExpiresIn: string;
  refreshExpiresIn: string;
}

interface AppConfig {
  port: number | string;
  nodeEnv: string;
  db: DBConfig;
  jwt: JWTConfig;
}

const config: AppConfig = {
  port: process.env.PORT || 4000,
  db: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'boilerplate_db'
  },
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    accessSecret: String(process.env.JWT_ACCESS_SECRET) || 'your_access_secret',
    refreshSecret: String(process.env.JWT_REFRESH_SECRET) || 'your_refresh_secret',
    accessExpiresIn: String(process.env.JWT_ACCESS_EXPIRES_IN) || '15m',
    refreshExpiresIn: String(process.env.JWT_REFRESH_EXPIRES_IN) || '7d'
  }
};

logger.table([
  { name: "PORT", value: config.port }, 
  { name: "NODE_ENV", value: config.nodeEnv }, 
  { name: "DATABASE_HOST", value: config.db.host }, 
  { name: "DATABASE_PORT", value: config.db.port }, 
  { name: "DATABASE_USER", value: config.db.username }, 
  { name: "DATABASE_NAME", value: config.db.database },
  { name: "JWT_ACCESS_SECRET", value: config.jwt.accessSecret },
  { name: "JWT_REFRESH_SECRET", value: config.jwt.refreshSecret },
  { name: "JWT_ACCESS_EXPIRES_IN", value: config.jwt.accessExpiresIn },
  { name: "JWT_REFRESH_EXPIRES_IN", value: config.jwt.refreshExpiresIn },
]);
export default config;
