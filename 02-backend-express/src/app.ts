import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';

const app = express();

// 1. Centralized Security & Parsing Middleware
app.use(helmet()); // Secure headers
app.use(cors());   // Enable CORS
app.use(express.json()); // Centralized Body Parsing
app.use(morgan('dev'));  // Centralized Request Logging

// 2. Health Check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'UP', timestamp: new Date().toISOString() });
});

// 3. Centralized Routing (Will be expanded)
// app.use('/api/tasks', taskRouter);

// 4. Centralized 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
});

// 5. Centralized Global Error Handler (The Catch-All)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  
  console.error(`[Error] ${err.message}`, {
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

export default app;
