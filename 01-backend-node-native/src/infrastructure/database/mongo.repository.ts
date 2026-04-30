import mongoose, { Schema, Document } from 'mongoose';
import { ITaskRepository } from '@domain/repositories/itask.repository';
import { Task, CreateTaskDto } from '@domain-types/task.types';

interface TaskDocument extends Document, Omit<Task, 'id'> {}

const TaskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
}, { timestamps: true });

const TaskModel = mongoose.model<TaskDocument>('Task', TaskSchema);

export class MongoTaskRepository implements ITaskRepository {
  async create(data: CreateTaskDto): Promise<Task> {
    const created = await TaskModel.create(data);
    return this.mapToEntity(created);
  }

  async findById(id: string): Promise<Task | null> {
    const found = await TaskModel.findById(id);
    return found ? this.mapToEntity(found) : null;
  }

  async findAll(): Promise<Task[]> {
    const list = await TaskModel.find();
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
      title: doc.title,
      description: doc.description,
      status: doc.status as Task['status'],
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
