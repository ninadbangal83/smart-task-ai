import mongoose, { Schema, Document } from 'mongoose';
import { ITaskRepository } from '@domain/repositories/itask.repository';
import { Task } from '@domain-types/task.types';

interface TaskDocument extends Document {
  userId: string;
  title: string;
  description?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<TaskDocument>({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const TaskModel = mongoose.model<TaskDocument>('Task', TaskSchema);

export class MongoTaskRepository implements ITaskRepository {
  async create(task: Task): Promise<Task> {
    const created = await TaskModel.create(task);
    return this.mapToEntity(created);
  }

  async findById(id: string, userId?: string): Promise<Task | null> {
    const query: Record<string, unknown> = { _id: id };
    if (userId) query.userId = userId;
    const found = await TaskModel.findOne(query as any);
    return found ? this.mapToEntity(found) : null;
  }

  async findAll(userId?: string): Promise<Task[]> {
    const query: Record<string, unknown> = {};
    if (userId) query.userId = userId;
    const list = await TaskModel.find(query as any);
    return list.map(this.mapToEntity);
  }

  async update(id: string, data: Partial<Task>): Promise<Task> {
    const updated = await TaskModel.findByIdAndUpdate(id, data, { new: true });
    if (!updated) throw new Error('Task not found');
    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await TaskModel.findByIdAndDelete(id);
  }

  private mapToEntity(doc: TaskDocument): Task {
    return {
      id: doc._id.toString(),
      userId: doc.userId,
      title: doc.title,
      description: doc.description,
      status: doc.status as Task['status'],
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
