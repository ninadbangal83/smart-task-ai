import mongoose, { Schema, Document } from 'mongoose';
import { IUserRepository } from '@domain/repositories/iuser.repository';
import { User, CreateUserDto } from '@domain-types/user.types';

interface UserDocument extends Document {
  email: string;
  password?: string;
  name: string;
  role: string;
  createdAt: Date;
}

const UserSchema = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
});

const UserModel = mongoose.model<UserDocument>('User', UserSchema);

export class MongoUserRepository implements IUserRepository {
  async create(data: CreateUserDto): Promise<User> {
    const created = await UserModel.create(data);
    return this.mapToEntity(created);
  }

  async findByEmail(email: string): Promise<User | null> {
    const found = await UserModel.findOne({ email });
    return found ? this.mapToEntity(found) : null;
  }

  async findById(id: string): Promise<User | null> {
    const found = await UserModel.findById(id);
    return found ? this.mapToEntity(found) : null;
  }

  async findAll(): Promise<User[]> {
    const list = await UserModel.find();
    return list.map(this.mapToEntity);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const updated = await UserModel.findByIdAndUpdate(id, data, { new: true });
    if (!updated) throw new Error('User not found');
    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id);
  }

  private mapToEntity(doc: UserDocument): User {
    return {
      id: doc._id.toString(),
      email: doc.email,
      password: doc.password,
      name: doc.name,
      role: doc.role as any,
      createdAt: doc.createdAt,
    };
  }
}
