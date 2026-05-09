import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import fs from 'fs';
import path from 'path';
import { authRouter } from '@api/routes/auth.routes';
import { taskRouter } from '@api/routes/task.routes';
import { userRouter } from '@api/routes/user.routes';
import { AppError } from '@shared/errors/app.error';
import { logger } from '@shared/utils/logger';
import { config } from '@config/app.config';

const app = express();

// 1. Centralized Security & Parsing Middleware
app.use(helmet()); 
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3004'],
  credentials: true
}));   
app.use(express.json()); 

// 2. High-Precision Request Profiling (Express Middleware)
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime();
  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const durationInMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);
    const logMsg = `${req.method} ${req.originalUrl} ${res.statusCode} - ${durationInMs}ms`;
    
    if (res.statusCode >= 400) logger.error(logMsg);
    else logger.info(logMsg);
  });
  next();
});

// 3. Health Check
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'UP', 
    timestamp: new Date().toISOString(),
    authStrategy: config.AUTH_TYPE
  });
});

// 4. API Documentation (Swagger)
app.get('/api/docs', (req: Request, res: Response) => {
  try {
    const docsPath = path.join(process.cwd(), 'src/api/docs/swagger.json');
    const docs = fs.readFileSync(docsPath, 'utf8');
    res.status(200).type('application/json').send(docs);
  } catch (err: any) {
    res.status(404).json({ message: 'Swagger documentation not found' });
  }
});

// 5. Centralized Routers
app.use('/api/auth', authRouter);
app.use('/api/tasks', taskRouter);
app.use('/api', userRouter);

// 6. Centralized 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
});

// 7. Centralized Global Error Handler (The Catch-All)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  
  logger.error(`[Express API Error] ${err.message}`, {
    method: req.method,
    url: req.originalUrl,
    stack: err.stack
  });

  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    stack: config.NODE_ENV === 'development' ? err.stack : undefined
  });
});

export default app;
