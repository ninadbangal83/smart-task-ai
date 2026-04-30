import mongoose from 'mongoose';
import { config } from '@config/app.config';
import { logger } from '@shared/utils/logger';

export const initMongo = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    logger.info('✅ MongoDB Connected Successfully');
  } catch (err: any) {
    logger.error('❌ MongoDB Connection Failed:', { error: err.message });
    throw err;
  }
};
