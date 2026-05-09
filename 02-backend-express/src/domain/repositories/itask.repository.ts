import { Task } from '@domain-types/task.types';

export interface ITaskRepository {
  create(task: Task): Promise<Task>;
  findById(id: string, userId?: string): Promise<Task | null>;
  findAll(userId?: string): Promise<Task[]>;
  update(id: string, task: Partial<Task>): Promise<Task>;
  delete(id: string): Promise<void>;
}
