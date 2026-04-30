import winston from 'winston';
import pino from 'pino';
import { config } from '@config/app.config';

// 1. Define Common Interface
interface ILogger {
  info: (msg: string, meta?: Record<string, unknown>) => void;
  error: (msg: string, meta?: Record<string, unknown>) => void;
  debug: (msg: string, meta?: Record<string, unknown>) => void;
  warn: (msg: string, meta?: Record<string, unknown>) => void;
}

// 2. Winston Implementation
const createWinstonLogger = (): ILogger => {
  const { combine, timestamp, printf, colorize, json } = winston.format;
  const consoleFormat = printf((info: any) => {
    const { level, message, timestamp, ...metadata } = info;
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(metadata).length > 0) msg += ` ${JSON.stringify(metadata)}`;
    return msg;
  });

  const winstonInstance = winston.createLogger({
    level: config.NODE_ENV === 'development' ? 'debug' : 'info',
    format: combine(
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      config.NODE_ENV === 'development' ? colorize() : json()
    ),
    transports: [
      new winston.transports.Console({
        format: config.NODE_ENV === 'development' ? consoleFormat : json()
      }),
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    ],
  });

  return {
    info: (msg, meta) => winstonInstance.info(msg, meta),
    error: (msg, meta) => winstonInstance.error(msg, meta),
    debug: (msg, meta) => winstonInstance.debug(msg, meta),
    warn: (msg, meta) => winstonInstance.warn(msg, meta),
  };
};

// 3. Pino Implementation
const createPinoLogger = (): ILogger => {
  const pinoInstance = pino({
    level: config.NODE_ENV === 'development' ? 'debug' : 'info',
    transport: config.NODE_ENV === 'development' ? {
      target: 'pino-pretty',
      options: { colorize: true }
    } : undefined
  });

  return {
    info: (msg, meta) => pinoInstance.info(meta || {}, msg),
    error: (msg, meta) => pinoInstance.error(meta || {}, msg),
    debug: (msg, meta) => pinoInstance.debug(meta || {}, msg),
    warn: (msg, meta) => pinoInstance.warn(meta || {}, msg),
  };
};

// 4. Factory Export
export const logger: ILogger = config.LOGGER_TYPE === 'PINO' 
  ? createPinoLogger() 
  : createWinstonLogger();
