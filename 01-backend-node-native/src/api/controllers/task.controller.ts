import { IncomingMessage, ServerResponse } from 'http';
import { RepositoryFactory } from '@infra/repository.factory';
import { BadRequestError } from '@shared/errors/app.error';

const repository = RepositoryFactory.getRepository();

export class TaskController {
  static async getAll(req: IncomingMessage, res: ServerResponse) {
    const tasks = await repository.findAll();
    res.writeHead(200);
    res.end(JSON.stringify(tasks));
  }

  static async create(req: IncomingMessage, res: ServerResponse) {
    let body = '';
    req.on('data', chunk => body += chunk);
    
    req.on('end', async () => {
      try {
        const { title, description } = JSON.parse(body);
        if (!title) throw new BadRequestError('Title is required');

        const task = await repository.create({ title, description });
        res.writeHead(201);
        res.end(JSON.stringify(task));
      } catch (err: any) {
        TaskController.handleError(res, err);
      }
    });
  }

  private static handleError(res: ServerResponse, err: any) {
    const statusCode = err.statusCode || 500;
    res.writeHead(statusCode);
    res.end(JSON.stringify({
      status: 'error',
      message: err.message || 'Internal Server Error'
    }));
  }
}
