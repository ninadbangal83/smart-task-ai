import { config } from '@config/app.config';
import { ITaskRepository } from '@domain/repositories/itask.repository';
import { MongoTaskRepository } from '@infra/database/mongo.repository';
import { PostgresTaskRepository } from '@infra/database/postgres.repository';
import { User } from '@domain-types/user.types';

export class RepositoryFactory {
  static getTaskRepository(): ITaskRepository {
    const dbType = config.DB_TYPE;
    return dbType.toUpperCase() === 'MONGO' ? new MongoTaskRepository() : new PostgresTaskRepository();
  }

  // Adding User Repository Support
  static getUserRepository(): any {
    // In a real industrial app, we would have MongoUserRepository and PostgresUserRepository
    // For this mastery demo, we'll return a simple in-memory repo to keep it focused on the Auth logic
    return {
      users: [] as User[],
      async create(data: any) {
        const user = { ...data, id: Math.random().toString(36).substr(2, 9), createdAt: new Date() } as User;
        this.users.push(user);
        return user;
      },
      async findByEmail(email: string) {
        return this.users.find((u: User) => u.email === email) || null;
      }
    };
  }
}


