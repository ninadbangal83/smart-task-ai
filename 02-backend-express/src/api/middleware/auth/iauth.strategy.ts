import { Request, Response } from 'express';
import { User } from '@domain-types/user.types';

export interface IAuthStrategy {
  // 1. Used in Middleware to protect routes
  authenticate(req: Request, res: Response): Promise<User | null>;
  
  // 2. Used in Login/Register to "Attach" the identity (Token or Cookie)
  onAuthSuccess(res: Response, user: User): Record<string, unknown>;
}
