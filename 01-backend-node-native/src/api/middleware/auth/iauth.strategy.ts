import { IncomingMessage, ServerResponse } from 'http';
import { User } from '@domain-types/user.types';

export interface IAuthStrategy {
  // 1. Used in Middleware to protect routes
  authenticate(req: IncomingMessage, res: ServerResponse): Promise<User | null>;
  
  // 2. Used in Login/Register to "Attach" the identity (Token or Cookie)
  onAuthSuccess(res: ServerResponse, user: User): any;
}

