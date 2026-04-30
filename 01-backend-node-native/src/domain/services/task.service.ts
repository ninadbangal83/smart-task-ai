import { RepositoryFactory } from '@infra/repository.factory';
import { RedisService } from '@infra/cache/redis.service';
import { BrokerFactory } from '@infra/broker/broker.factory';
import { TaskEntity } from '@domain/entities/task.entity';
import { CreateTaskDto, Task } from '@domain-types/task.types';
import { NotFoundError, BadRequestError, ForbiddenError } from '@shared/errors/app.error';

const repository = RepositoryFactory.getTaskRepository();
const broker = BrokerFactory.getBroker();

export class TaskService {
  static async createTask(data: CreateTaskDto & { userId: string }): Promise<Task> {
    // 1. Logic inside Entity
    const newTask = TaskEntity.createNew(data.title, data.userId, data.description);

    // 2. Save to DB
    const savedTask = await repository.create(newTask);

    // 3. Cache the result
    await RedisService.set(`task:${savedTask.id}`, savedTask);

    // 4. Notify AI Worker
    await broker.publish('task_processing', {
      taskId: savedTask.id,
      userId: data.userId,
      action: 'analyze_priority'
    });

    return savedTask;
  }

  static async getTaskById(id: string, userId: string): Promise<Task> {
    const cached = await RedisService.get<Task>(`task:${id}`);
    if (cached && cached.userId === userId) return cached;

    const task = await repository.findById(id, userId);
    if (!task) throw new NotFoundError('Task not found or unauthorized');

    await RedisService.set(`task:${id}`, task);
    return task;
  }

  static async getAllTasks(userId: string): Promise<Task[]> {
    return await repository.findAll(userId);
  }

  static async updateTask(id: string, userId: string, data: Partial<Task>): Promise<Task> {
    const rawTask = await repository.findById(id, userId);
    if (!rawTask) throw new NotFoundError('Task not found');
    if (rawTask.userId !== userId) throw new ForbiddenError('You do not own this task');

    const taskEntity = new TaskEntity(rawTask);
    taskEntity.update(data);

    const updatedTask = await repository.update(id, taskEntity);
    await RedisService.set(`task:${id}`, updatedTask);
    
    return updatedTask;
  }

  static async deleteTask(id: string, userId: string): Promise<void> {
    const rawTask = await repository.findById(id, userId);
    if (!rawTask) return;
    if (rawTask.userId !== userId) throw new ForbiddenError('You do not own this task');

    const taskEntity = new TaskEntity(rawTask);
    if (!taskEntity.canBeDeleted()) {
      throw new BadRequestError('Cannot delete a completed task');
    }

    await repository.delete(id);
    await RedisService.del(`task:${id}`);
  }
}
