import { Request } from 'express';
import { User } from '@domain-types/user.types';

export interface AuthenticatedRequest extends Request {
  user: User;
}
