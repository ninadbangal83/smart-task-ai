import { RepositoryFactory } from '@infra/repository.factory';
import { RedisService } from '@infra/cache/redis.service';
import { BrokerFactory } from '@infra/broker/broker.factory';
import { TaskEntity } from '@domain/entities/task.entity';
import { CreateTaskDto, Task } from '@domain-types/task.types';
import { NotFoundError } from '@shared/errors/app.error';

const repository = RepositoryFactory.getTaskRepository();
const broker = BrokerFactory.getBroker();

export class TaskService {
  static async createTask(data: CreateTaskDto): Promise<Task> {
    // 1. Logic inside Entity
    const newTask = TaskEntity.createNew(data.title, data.description);

    // 2. Save to DB
    const savedTask = await repository.create(newTask);

    // 3. Cache the result
    await RedisService.set(`task:${savedTask.id}`, savedTask);

    // 4. Notify AI Worker via the Selected Broker
    await broker.publish('task_processing', {
      taskId: savedTask.id,
      action: 'analyze_priority'
    });

    return savedTask;
  }


  static async getTaskById(id: string): Promise<Task> {
    // 1. Try Cache First (Speed!)
    const cached = await RedisService.get<Task>(`task:${id}`);
    if (cached) return cached;

    // 2. Fallback to DB
    const task = await repository.findById(id);
    if (!task) throw new NotFoundError('Task not found');

    // 3. Update Cache for next time
    await RedisService.set(`task:${id}`, task);

    return task;
  }

  static async getAllTasks(): Promise<Task[]> {
    return await repository.findAll();
  }

  static async updateTask(id: string, data: Partial<Task>): Promise<Task> {
    const updatedTask = await repository.update(id, data);
    
    // Update cache
    await RedisService.set(`task:${id}`, updatedTask);
    
    return updatedTask;
  }

  static async deleteTask(id: string): Promise<void> {
    await repository.delete(id);
    
    // Remove from cache
    await RedisService.del(`task:${id}`);
  }
}

