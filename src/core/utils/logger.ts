import { createLogger, format, transports, Logger as WinstonLogger } from 'winston';
import Table from 'cli-table3';
import chalk from 'chalk';

const { combine, timestamp, printf, colorize } = format;

// Extend Winston Logger type to include `table` method
interface ExtendedLogger extends WinstonLogger {
  table: (data: object[] | object) => void;
}

// Standard log format
const logFormat = printf(({ level, message, timestamp }) => {
  if (typeof message === 'object') {
    return `${timestamp} [${level}]: ${JSON.stringify(message, null, 2)}`;
  }
  return `${timestamp} [${level}]: ${message}`;
});

const logger: ExtendedLogger = createLogger({
  level: 'info',
  format: combine(
    colorize({ all: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new transports.Console(),
  ],
  exitOnError: false,
}) as ExtendedLogger;

// Add table support
logger.table = (data: object[] | object) => {
  if (!data) return;
  const rows = Array.isArray(data) ? data : [data];
  if (rows.length === 0) return;

  const headers = Object.keys(rows[0]).map(header => chalk.blue.bold(header)); // header color

  // const headers = Object.keys(rows[0]);
  const table = new Table({ head: headers });
  //@ts-ignore
  rows.forEach(row => table.push(Object.values(row)));
  logger.info(`\n${table.toString()}`);
};

export default logger;
