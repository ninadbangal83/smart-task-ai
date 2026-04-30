import pkg from 'pg';
const { Pool } = pkg;
import { config } from '@config/app.config';
import { logger } from '@shared/utils/logger';

const pool = new Pool({
  connectionString: config.POSTGRES_URI
});

const schemaSQL = `
  CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

export const initPostgres = async () => {
  if (config.DB_TYPE !== 'POSTGRES') return;

  try {
    logger.info('🐘 Initializing PostgreSQL Tables...');
    await pool.query(schemaSQL);
    logger.info('✅ PostgreSQL Schema is up to date');
  } catch (err: any) {
    logger.error('❌ Failed to initialize PostgreSQL:', { error: err.message });
    throw err;
  }
};
