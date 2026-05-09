import app from './app';
import { config } from '@config/app.config';
import { logger } from '@shared/utils/logger';
import { initPostgres } from '@infra/database/postgres.init';
import { initMongo } from '@infra/database/mongo.init';

const PORT = config.PORT || 3001;

const startServer = async () => {
  try {
    // 1. Initialize Infrastructure
    logger.info(`📡 Initializing ${config.DB_TYPE} database...`);

    if (config.DB_TYPE === 'POSTGRES') {
      await initPostgres();
    } else {
      await initMongo();
    }
    
    // 2. Start Express Listener
    app.listen(PORT, () => {
      logger.info(`🚀 SmartTask Industrial Express Server running on port ${PORT}`);
      logger.info(`🔧 Mode: ${config.NODE_ENV}`);
    });
  } catch (err: any) {
    logger.error('❌ Failed to start server:', { error: err.message });
    process.exit(1);
  }
};

startServer();
