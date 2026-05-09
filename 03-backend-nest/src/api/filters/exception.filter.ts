import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response, Request } from 'express';
import { AppError } from '@shared/errors/app.error';
import { logger } from '@shared/utils/logger';
import { config } from '@config/app.config';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = 500;
    let message = 'Internal Server Error';

    if (exception instanceof AppError) {
      statusCode = exception.statusCode;
      message = exception.message;
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const resContent: any = exception.getResponse();
      message = typeof resContent === 'string' ? resContent : resContent.message || exception.message;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    logger.error(`[NestJS API Error] ${message}`, {
      method: request.method,
      url: request.url,
      stack: exception.stack,
    });

    response.status(statusCode).json({
      status: 'error',
      message,
      stack: config.NODE_ENV === 'development' ? exception.stack : undefined,
    });
  }
}
