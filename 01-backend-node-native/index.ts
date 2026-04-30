import http, { IncomingMessage, ServerResponse } from 'http';
import 'dotenv/config';
import { handleTaskRoutes } from '@api/routes/task.routes';
import { AppError } from '@shared/errors/app.error';

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
  // Global Headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('X-Powered-By', 'SmartTask-Native-Core');

  try {
    // 1. Dispatch to Task Routes
    const handled = await handleTaskRoutes(req, res);
    
    // 2. If no route handled the request, it's a 404
    if (!handled) {
      res.writeHead(404);
      res.end(JSON.stringify({ message: `Route ${req.method} ${req.url} not found` }));
    }


  } catch (error: any) {
    // Global Centralized Error Handler
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    console.error(`[ERROR] ${error.message}`);
    
    res.writeHead(statusCode);
    res.end(JSON.stringify({
      status: 'error',
      message: error.message || 'Something went wrong',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }));
  }
});

// Initialization Logic (Industrial standard)
const startServer = async () => {
  try {
    // Here we would initialize Redis, Mongo/Postgres pool, and Brokers
    console.log(`📡 Initializing ${process.env.DB_TYPE} database...`);
    
    server.listen(PORT, () => {
      console.log(`🚀 SmartTask Industrial Native Server running on port ${PORT}`);
      console.log(`🔧 Mode: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
