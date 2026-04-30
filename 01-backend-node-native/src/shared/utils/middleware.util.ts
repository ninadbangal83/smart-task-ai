import { IncomingMessage, ServerResponse } from 'http';
import { AuthenticatedRequest, MiddlewareNext } from '../types/http.types';

type Middleware = (
  req: IncomingMessage | AuthenticatedRequest,
  res: ServerResponse,
  next: MiddlewareNext
) => Promise<void>;

export const runMiddleware = async (
  req: IncomingMessage | AuthenticatedRequest,
  res: ServerResponse,
  middlewares: Middleware[],
  handler: () => Promise<void>
) => {
  let index = 0;

  const next = async (): Promise<any> => {
    if (index < middlewares.length) {
      const middleware = middlewares[index++];
      return await middleware(req, res, next);
    }
    return await handler();
  };

  return await next();
};
