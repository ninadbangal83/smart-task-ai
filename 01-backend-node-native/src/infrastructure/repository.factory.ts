import { ITaskRepository } from '@domain/repositories/itask.repository';
import { MongoTaskRepository } from '@infra/database/mongo.repository';
import { PostgresTaskRepository } from '@infra/database/postgres.repository';

export class RepositoryFactory {
  static getRepository(): ITaskRepository {
    const dbType = process.env.DB_TYPE || 'MONGO';

    switch (dbType.toUpperCase()) {
      case 'MONGO':
        return new MongoTaskRepository();
      case 'POSTGRES':
        return new PostgresTaskRepository();
      default:
        throw new Error(`Unsupported database type: ${dbType}`);
    }
  }
}
