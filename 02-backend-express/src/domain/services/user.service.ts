import { RepositoryFactory } from '@infra/repository.factory';
import { User } from '@domain-types/user.types';
import { NotFoundError, ForbiddenError } from '@shared/errors/app.error';
import { logger } from '@shared/utils/logger';

const userRepo = RepositoryFactory.getUserRepository();

export class UserService {
  // Admin only
  static async getAllUsers(): Promise<User[]> {
    return await userRepo.findAll();
  }

  // Admin or Self
  static async getUserById(id: string, requester: User): Promise<User> {
    if (requester.id !== id && requester.role !== 'admin') {
      throw new ForbiddenError('Access Denied');
    }
    const user = await userRepo.findById(id);
    if (!user) throw new NotFoundError('User not found');
    return user;
  }

  // Admin or Self
  static async updateUser(id: string, requester: User, data: Partial<User>): Promise<User> {
    if (requester.id !== id && requester.role !== 'admin') {
      throw new ForbiddenError('Access Denied');
    }
    
    // Prevent non-admins from upgrading their own role
    if (requester.role !== 'admin' && data.role) {
      delete data.role;
    }

    const updated = await userRepo.update(id, data);
    logger.info(`👤 User updated: ${id} by ${requester.id}`);
    return updated;
  }

  // Admin or Self
  static async deleteUser(id: string, requester: User): Promise<void> {
    if (requester.id !== id && requester.role !== 'admin') {
      throw new ForbiddenError('Access Denied');
    }
    await userRepo.delete(id);
    logger.info(`🗑️ User deleted: ${id} by ${requester.id}`);
  }
}
