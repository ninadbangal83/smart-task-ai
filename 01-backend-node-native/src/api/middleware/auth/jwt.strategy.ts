import { IncomingMessage, ServerResponse } from 'http';
import { IAuthStrategy } from './iauth.strategy';
import { User } from '@domain-types/user.types';
import { AuthUtil } from '@shared/utils/auth.util';

export class JWTAuthStrategy implements IAuthStrategy {
  async authenticate(req: IncomingMessage): Promise<User | null> {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

    const token = authHeader.split(' ')[1];
    const decoded = AuthUtil.verifyToken(token);
    
    return decoded || null;
  }

  onAuthSuccess(res: ServerResponse, user: User): any {
    const token = AuthUtil.generateToken({ id: user.id, email: user.email });
    res.setHeader('X-Auth-Token', token);
    return { token };
  }
}

