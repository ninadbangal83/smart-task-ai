import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { config } from '@config/app.config';

export class AuthUtil {
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  static generateToken(payload: string | object | Buffer): string {
    return jwt.sign(payload, config.JWT_SECRET, { expiresIn: '1d' });
  }

  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, config.JWT_SECRET);
    } catch (err: unknown) {
      return null;
    }
  }
}
