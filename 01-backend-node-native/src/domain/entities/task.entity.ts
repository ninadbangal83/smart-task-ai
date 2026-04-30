import { Task } from '@domain-types/task.types';

export class TaskEntity implements Task {
  public id: string;
  public title: string;
  public description?: string;
  public status: Task['status'];
  public createdAt: Date;
  public updatedAt: Date;

  constructor(data: Task) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.status = data.status;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  // Example of a Business Rule inside an Entity
  public markAsCompleted() {
    this.status = 'completed';
    this.updatedAt = new Date();
  }

  public validate() {
    if (this.title.length < 3) {
      throw new Error('Title must be at least 3 characters long');
    }
  }

  // Static method to create a new task instance from raw data
  static createNew(title: string, description?: string): TaskEntity {
    const now = new Date();
    const task = new TaskEntity({
      id: Math.random().toString(36).substr(2, 9), // Simple ID generator
      title,
      description,
      status: 'pending',
      createdAt: now,
      updatedAt: now
    });
    
    task.validate();
    return task;
  }
}
