import { ServerResponse } from 'http';
import { RepositoryFactory } from '@infra/repository.factory';
import { AuthUtil } from '@shared/utils/auth.util';
import { CreateUserDto } from '@domain-types/user.types';
import { BadRequestError, UnauthorizedError } from '@shared/errors/app.error';
import { AuthFactory } from '@api/middleware/auth/auth.factory';
import { logger } from '@shared/utils/logger';

const userRepo = RepositoryFactory.getUserRepository();

export class AuthService {
  static async register(data: CreateUserDto, res: ServerResponse) {
    const existingUser = await userRepo.findByEmail(data.email);
    if (existingUser) {
      logger.warn(`⚠️ Registration failed: Email ${data.email} already exists`);
      throw new BadRequestError('User already exists');
    }

    const hashedPassword = await AuthUtil.hashPassword(data.password!);
    
    // Industrial logic: First user is automatically Admin
    const allUsers = await userRepo.findAll();
    const role = allUsers.length === 0 ? 'admin' : (data.role || 'user');

    const user = await userRepo.create({ ...data, password: hashedPassword, role });
    
    logger.info(`👤 New User registered: ${user.email} (ID: ${user.id}) as ${user.role}`);

    // Use Strategy to handle success (Token or Cookie)
    const authData = AuthFactory.getStrategy().onAuthSuccess(res, user);
    
    return { user, ...authData };
  }

  static async login(email: string, password: string, res: ServerResponse) {
    const user = await userRepo.findByEmail(email);
    if (!user) {
      logger.warn(`❌ Login attempt failed: User not found (${email})`);
      throw new UnauthorizedError('Invalid credentials');
    }

    const isValid = await AuthUtil.comparePassword(password, user.password!);
    if (!isValid) {
      logger.warn(`❌ Login attempt failed: Incorrect password for ${email}`);
      throw new UnauthorizedError('Invalid credentials');
    }

    // Use Strategy to handle success (Token or Cookie)
    const authData = AuthFactory.getStrategy().onAuthSuccess(res, user);
    
    logger.info(`✅ User logged in successfully: ${user.email}`);

    return { user, ...authData };
  }
}
