import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './api/filters/exception.filter';
import { config } from '@config/app.config';
import { logger } from '@shared/utils/logger';
import { initPostgres } from '@infra/database/postgres.init';
import { initMongo } from '@infra/database/mongo.init';

async function bootstrap() {
  try {
    // 1. Initialize Infrastructure (Mongo/PostgreSQL)
    logger.info(`📡 Initializing ${config.DB_TYPE} database inside NestJS...`);

    if (config.DB_TYPE === 'POSTGRES') {
      await initPostgres();
    } else {
      await initMongo();
    }

    // 2. Bootstrap NestJS Application
    const app = await NestFactory.create(AppModule);

    // 3. Centralized Global Exception Filters & Security
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.enableCors({
      origin: true,
      credentials: true, // Support session cookie strategy
    });

    // 4. Start NestJS Listener (Binding on Port 3002)
    const PORT = 3002;
    await app.listen(PORT);
    logger.info(`🚀 SmartTask Industrial NestJS Server running on port ${PORT}`);
    logger.info(`🔧 Mode: ${config.NODE_ENV}`);
  } catch (err: any) {
    logger.error('❌ Failed to start NestJS server:', { error: err.message });
    process.exit(1);
  }
}
bootstrap();
