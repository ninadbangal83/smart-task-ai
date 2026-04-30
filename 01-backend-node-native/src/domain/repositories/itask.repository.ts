import { Task, CreateTaskDto } from '@domain-types/task.types';

export interface ITaskRepository {
  create(data: CreateTaskDto): Promise<Task>;
  findById(id: string): Promise<Task | null>;
  findAll(): Promise<Task[]>;
  update(id: string, data: Partial<Task>): Promise<Task>;
  delete(id: string): Promise<void>;
}
