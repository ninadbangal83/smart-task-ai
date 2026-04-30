import { RepositoryFactory } from '@infra/repository.factory';
import { AuthUtil } from '@shared/utils/auth.util';
import { CreateUserDto } from '@domain-types/user.types';
import { BadRequestError, UnauthorizedError } from '@shared/errors/app.error';

const userRepo = RepositoryFactory.getUserRepository();

export class AuthService {
  static async register(data: CreateUserDto) {
    const existingUser = await userRepo.findByEmail(data.email);
    if (existingUser) throw new BadRequestError('User already exists');

    const hashedPassword = await AuthUtil.hashPassword(data.password!);
    const user = await userRepo.create({ ...data, password: hashedPassword });
    
    // Generate token immediately after register
    const token = AuthUtil.generateToken({ id: user.id, email: user.email });
    return { user, token };
  }

  static async login(email: string, password: string) {
    const user = await userRepo.findByEmail(email);
    if (!user) throw new UnauthorizedError('Invalid credentials');

    const isValid = await AuthUtil.comparePassword(password, user.password!);
    if (!isValid) throw new UnauthorizedError('Invalid credentials');

    const token = AuthUtil.generateToken({ id: user.id, email: user.email });
    return { user, token };
  }
}
