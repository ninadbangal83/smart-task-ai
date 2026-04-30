import { IncomingMessage, ServerResponse } from 'http';
import { TaskService } from '@domain/services/task.service';
import { BadRequestError } from '@shared/errors/app.error';
import { ResponseUtil } from '@shared/utils/response.util';
import { RequestUtil } from '@shared/utils/request.util';
import { logger } from '@shared/utils/logger';

export class TaskController {
  static async getAll(req: IncomingMessage, res: ServerResponse) {
    const userId = (req as any).user.id;
    const tasks = await TaskService.getAllTasks(userId);
    ResponseUtil.success(res, tasks);
  }

  static async getById(req: IncomingMessage, res: ServerResponse, id: string) {
    const userId = (req as any).user.id;
    const task = await TaskService.getTaskById(id, userId);
    ResponseUtil.success(res, task);
  }

  static async create(req: IncomingMessage, res: ServerResponse) {
    try {
      const userId = (req as any).user.id;
      const { title, description } = await RequestUtil.getBody<{ title: string, description: string }>(req);
      if (!title) throw new BadRequestError('Title is required');

      const task = await TaskService.createTask({ title, description, userId } as any);
      ResponseUtil.success(res, task, 201);
    } catch (err: any) {
      TaskController.handleError(res, err);
    }
  }

  static async update(req: IncomingMessage, res: ServerResponse, id: string) {
    try {
      const userId = (req as any).user.id;
      const data = await RequestUtil.getBody<any>(req);
      const task = await TaskService.updateTask(id, userId, data);
      ResponseUtil.success(res, task);
    } catch (err: any) {
      TaskController.handleError(res, err);
    }
  }

  static async delete(req: IncomingMessage, res: ServerResponse, id: string) {
    const userId = (req as any).user.id;
    await TaskService.deleteTask(id, userId);
    ResponseUtil.success(res, null, 204);
  }

  private static handleError(res: ServerResponse, err: any) {
    const statusCode = err.statusCode || 500;
    ResponseUtil.error(res, err.message || 'Internal Server Error', statusCode);
  }
}
