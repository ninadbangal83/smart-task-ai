import { Request, Response } from 'express';
import { IAuthStrategy } from './iauth.strategy';
import { User } from '@domain-types/user.types';
import { RedisService } from '@infra/cache/redis.service';
import crypto from 'crypto';

export class SessionAuthStrategy implements IAuthStrategy {
  async authenticate(req: Request): Promise<User | null> {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) return null;

    // Manual cookie parsing (Express can do this or we can keep the native/universal way)
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map(c => c.trim().split('='))
    );
    
    const sessionId = cookies['sid'];
    if (!sessionId) return null;

    const sessionData = await RedisService.get<User>(`session:${sessionId}`);
    return sessionData || null;
  }

  onAuthSuccess(res: Response, user: User): Record<string, unknown> {
    const sessionId = crypto.randomBytes(32).toString('hex');
    
    // Store in Redis (1 day expiry)
    RedisService.set(`session:${sessionId}`, user, 86400);

    // Set HttpOnly Cookie (Security!)
    res.setHeader('Set-Cookie', `sid=${sessionId}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax`);

    return { session: 'active' };
  }
}
