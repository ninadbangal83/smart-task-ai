import { Request, Response } from 'express';
import { IAuthStrategy } from './iauth.strategy';
import { User } from '@domain-types/user.types';
import { AuthUtil } from '@shared/utils/auth.util';

export class JWTAuthStrategy implements IAuthStrategy {
  async authenticate(req: Request): Promise<User | null> {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

    const token = authHeader.split(' ')[1];
    const decoded = AuthUtil.verifyToken(token);
    
    return decoded || null;
  }

  onAuthSuccess(res: Response, user: User): Record<string, unknown> {
    const token = AuthUtil.generateToken({ 
      id: user.id, 
      email: user.email, 
      role: user.role 
    });
    res.setHeader('X-Auth-Token', token);
    return { token };
  }
}
