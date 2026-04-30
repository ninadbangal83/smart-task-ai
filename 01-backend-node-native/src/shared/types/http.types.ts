import { IncomingMessage } from 'http';
import { User } from '@domain-types/user.types';

export interface AuthenticatedRequest extends IncomingMessage {
  user: User;
}

export type MiddlewareNext = () => Promise<void>;

export type Middleware = (
  req: IncomingMessage | AuthenticatedRequest,
  res: any, // We keep res as any for now or use ServerResponse
  next: MiddlewareNext
) => Promise<void>;
