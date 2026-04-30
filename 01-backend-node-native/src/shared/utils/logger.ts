import winston from 'winston';
import { config } from '@config/app.config';

const { combine, timestamp, printf, colorize, json } = winston.format;

// Custom format for local development
const consoleFormat = printf((info: any) => {
  const { level, message, timestamp, ...metadata } = info;
  let msg = `${timestamp} [${level}]: ${message}`;
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  return msg;
});

export const logger = winston.createLogger({
  level: config.NODE_ENV === 'development' ? 'debug' : 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    config.NODE_ENV === 'development' ? colorize() : json()
  ),
  transports: [
    // 1. Always log to console
    new winston.transports.Console({
      format: config.NODE_ENV === 'development' ? consoleFormat : json()
    }),
    // 2. Save errors to a separate file in production
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    // 3. Save all logs to a combined file
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});
