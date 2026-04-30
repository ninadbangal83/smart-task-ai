import { IncomingMessage, ServerResponse } from 'http';
import { TaskService } from '@domain/services/task.service';
import { BadRequestError } from '@shared/errors/app.error';
import { ResponseUtil } from '@shared/utils/response.util';
import { RequestUtil } from '@shared/utils/request.util';
import { AuthenticatedRequest } from '@shared/types/http.types';

export class TaskController {
  static async getAll(req: IncomingMessage, res: ServerResponse) {
    const user = (req as AuthenticatedRequest).user;
    const tasks = await TaskService.getAllTasks(user);
    ResponseUtil.success(res, tasks);
  }

  static async getById(req: IncomingMessage, res: ServerResponse, id: string) {
    const user = (req as AuthenticatedRequest).user;
    const task = await TaskService.getTaskById(id, user);
    ResponseUtil.success(res, task);
  }

  static async create(req: IncomingMessage, res: ServerResponse) {
    const user = (req as AuthenticatedRequest).user;
    const { title, description } = await RequestUtil.getBody<{ title: string, description: string }>(req);
    if (!title) throw new BadRequestError('Title is required');

    const task = await TaskService.createTask({ title, description, userId: user.id } as any);
    ResponseUtil.success(res, task, 201);
  }

  static async update(req: IncomingMessage, res: ServerResponse, id: string) {
    const user = (req as AuthenticatedRequest).user;
    const data = await RequestUtil.getBody<Record<string, any>>(req);
    const task = await TaskService.updateTask(id, user, data);
    ResponseUtil.success(res, task);
  }

  static async delete(req: IncomingMessage, res: ServerResponse, id: string) {
    const user = (req as AuthenticatedRequest).user;
    await TaskService.deleteTask(id, user);
    ResponseUtil.success(res, null, 204);
  }
}
