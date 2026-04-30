import { config } from '@config/app.config';
import { ITaskRepository } from '@domain/repositories/itask.repository';
import { IUserRepository } from '@domain/repositories/iuser.repository';
import { MongoTaskRepository } from '@infra/database/mongo.repository';
import { MongoUserRepository } from '@infra/database/mongo.user.repository';
import { PostgresTaskRepository } from '@infra/database/postgres.repository';
import { PostgresUserRepository } from '@infra/database/postgres.user.repository';
import { User } from '@domain-types/user.types';

export class RepositoryFactory {
  static getTaskRepository(): ITaskRepository {
    const dbType = config.DB_TYPE.toUpperCase();
    return dbType === 'MONGO' ? new MongoTaskRepository() : new PostgresTaskRepository();
  }

  static getUserRepository(): IUserRepository {
    const dbType = config.DB_TYPE.toUpperCase();
    return dbType === 'MONGO' ? new MongoUserRepository() : new PostgresUserRepository();
  }
}


