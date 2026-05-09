import http, { IncomingMessage, ServerResponse } from 'http';
import fs from 'fs';
import path from 'path';
import { config } from '@config/app.config';
import { handleTaskRoutes } from '@api/routes/task.routes';
import { handleAuthRoutes } from '@api/routes/auth.routes';
import { handleUserRoutes } from '@api/routes/user.routes';
import { AppError } from '@shared/errors/app.error';
import { logger } from '@shared/utils/logger';
import { initPostgres } from '@infra/database/postgres.init';
import { initMongo } from '@infra/database/mongo.init';

const PORT = config.PORT;

const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
  // 1. High-Precision Request Tracking (Pure Native)
  const start = process.hrtime();
  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const durationInMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);
    const logMsg = `${req.method} ${req.url} ${res.statusCode} - ${durationInMs}ms`;
    
    if (res.statusCode >= 400) logger.error(logMsg);
    else logger.info(logMsg);
  });

  // 2. Global Security Headers & CORS (Native Helmet + CORS)
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-Auth-Token');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('X-Powered-By', 'SmartTask-Native-Core');

  // Handle pre-flight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  const { method, url } = req;

  try {
    // 00. Health Check Endpoint (Used by Frontend)
    if (url === '/health' && method === 'GET') {
      res.writeHead(200);
      return res.end(JSON.stringify({ 
        status: 'UP', 
        timestamp: new Date().toISOString(),
        database: config.DB_TYPE,
        broker: config.BROKER_TYPE,
        mode: config.NODE_ENV,
        authStrategy: config.AUTH_TYPE
      }));
    }

    // 0. API Documentation (Swagger)
    if (url === '/api/docs' && method === 'GET') {
      const docsPath = path.join(process.cwd(), 'src/api/docs/swagger.json');
      const docs = fs.readFileSync(docsPath, 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(docs);
    }

    // 1. Dispatch to Auth Routes (Public)
    await handleAuthRoutes(req, res);
    if (res.writableEnded) return;

    // 2. Dispatch to Task Routes (Protected)
    await handleTaskRoutes(req, res);
    if (res.writableEnded) return;

    // 3. Dispatch to User/Admin Routes (Mixed)
    await handleUserRoutes(req, res);
    if (res.writableEnded) return;
    
    // 4. If no route handled the request, it's a 404
    res.writeHead(404);
    res.end(JSON.stringify({ message: `Route ${req.method} ${req.url} not found` }));



  } catch (error: any) {
    // Global Centralized Error Handler
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    logger.error(`[API Error] ${error.message}`, { 
      method: req.method, 
      url: req.url,
      stack: error.stack 
    });
    
    res.writeHead(statusCode);
    res.end(JSON.stringify({
      status: 'error',
      message: error.message || 'Something went wrong',
      stack: config.NODE_ENV === 'development' ? error.stack : undefined
    }));
  }
});

// Initialization Logic (Industrial standard)
const startServer = async () => {
  try {
    // 1. Initialize Infrastructure
    logger.info(`📡 Initializing ${config.DB_TYPE} database...`);

    if (config.DB_TYPE === 'POSTGRES') {
      await initPostgres();
    } else {
      await initMongo();
    }
    
    server.listen(PORT, () => {
      logger.info(`🚀 SmartTask Industrial Native Server running on port ${PORT}`);
      logger.info(`🔧 Mode: ${config.NODE_ENV}`);
    });
  } catch (err: any) {
    logger.error('❌ Failed to start server:', { error: err.message });
    process.exit(1);
  }
};

startServer();
