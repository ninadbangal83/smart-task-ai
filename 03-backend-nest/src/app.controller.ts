import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import fs from 'fs';
import path from 'path';
import { config } from './config/app.config';

@Controller()
export class AppController {
  @Get('health')
  getHealth() {
    return { 
      status: 'UP', 
      timestamp: new Date().toISOString(),
      authStrategy: config.AUTH_TYPE
    };
  }

  @Get('api/docs')
  getDocs(@Res() res: Response) {
    try {
      const docsPath = path.join(process.cwd(), 'src/api/docs/swagger.json');
      const docs = fs.readFileSync(docsPath, 'utf8');
      res.status(200).type('application/json').send(docs);
    } catch (err) {
      res.status(404).json({ message: 'Swagger documentation not found' });
    }
  }
}
