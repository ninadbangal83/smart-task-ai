import { Request, Response, NextFunction } from 'express';
import { TaskService } from '@domain/services/task.service';
import { BadRequestError } from '@shared/errors/app.error';
import { ResponseUtil } from '@shared/utils/response.util';
import { AuthenticatedRequest } from '@shared/types/http.types';

export class TaskController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as AuthenticatedRequest).user;
      const tasks = await TaskService.getAllTasks(user);
      ResponseUtil.success(res, tasks);
    } catch (err: any) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as AuthenticatedRequest).user;
      const { id } = req.params;
      const task = await TaskService.getTaskById(id, user);
      ResponseUtil.success(res, task);
    } catch (err: any) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as AuthenticatedRequest).user;
      const { title, description } = req.body;
      if (!title) throw new BadRequestError('Title is required');

      const task = await TaskService.createTask({ title, description, userId: user.id } as any);
      ResponseUtil.success(res, task, 201);
    } catch (err: any) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as AuthenticatedRequest).user;
      const { id } = req.params;
      const data = req.body;
      const task = await TaskService.updateTask(id, user, data);
      ResponseUtil.success(res, task);
    } catch (err: any) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as AuthenticatedRequest).user;
      const { id } = req.params;
      await TaskService.deleteTask(id, user);
      ResponseUtil.success(res, null, 204);
    } catch (err: any) {
      next(err);
    }
  }
}
