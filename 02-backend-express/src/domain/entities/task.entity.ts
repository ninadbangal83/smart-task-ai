import { Task } from '@domain-types/task.types';

export class TaskEntity implements Task {
  public id: string;
  public userId: string;
  public title: string;
  public description?: string;
  public status: 'pending' | 'completed';
  public createdAt: Date;
  public updatedAt: Date;

  constructor(data: Task) {
    this.id = data.id;
    this.userId = data.userId;
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

  // RICH DOMAIN LOGIC: Update method
  public update(data: Partial<Task>) {
    if (data.title) {
      this.title = data.title;
      this.validate(); // Enforce rule on update!
    }
    this.description = data.description ?? this.description;
    this.status = data.status ?? this.status;
    this.updatedAt = new Date();
  }

  // RICH DOMAIN LOGIC: Deletion Guard
  public canBeDeleted(): boolean {
    // Business Rule: Cannot delete completed tasks
    return this.status !== 'completed';
  }

  // Static method to create a new task instance from raw data
  static createNew(title: string, userId: string, description?: string): TaskEntity {
    const now = new Date();
    const task = new TaskEntity({
      id: Math.random().toString(36).substr(2, 9),
      userId,
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
