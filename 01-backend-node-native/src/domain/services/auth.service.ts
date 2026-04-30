import { ServerResponse } from 'http';
import { RepositoryFactory } from '@infra/repository.factory';
import { AuthUtil } from '@shared/utils/auth.util';
import { CreateUserDto } from '@domain-types/user.types';
import { BadRequestError, UnauthorizedError } from '@shared/errors/app.error';
import { AuthFactory } from '@api/middleware/auth/auth.factory';

const userRepo = RepositoryFactory.getUserRepository();

export class AuthService {
  static async register(data: CreateUserDto, res: ServerResponse) {
    const existingUser = await userRepo.findByEmail(data.email);
    if (existingUser) throw new BadRequestError('User already exists');

    const hashedPassword = await AuthUtil.hashPassword(data.password!);
    const user = await userRepo.create({ ...data, password: hashedPassword });
    
    // Use Strategy to handle success (Token or Cookie)
    const authData = AuthFactory.getStrategy().onAuthSuccess(res, user);
    
    return { user, ...authData };
  }

  static async login(email: string, password: string, res: ServerResponse) {
    const user = await userRepo.findByEmail(email);
    if (!user) throw new UnauthorizedError('Invalid credentials');

    const isValid = await AuthUtil.comparePassword(password, user.password!);
    if (!isValid) throw new UnauthorizedError('Invalid credentials');

    // Use Strategy to handle success (Token or Cookie)
    const authData = AuthFactory.getStrategy().onAuthSuccess(res, user);
    
    return { user, ...authData };
  }
}
