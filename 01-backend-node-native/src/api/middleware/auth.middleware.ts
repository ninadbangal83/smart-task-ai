import { IncomingMessage, ServerResponse } from 'http';
import { ResponseUtil } from '@shared/utils/response.util';
import { AuthFactory } from './auth/auth.factory';
import { logger } from '@shared/utils/logger';
import { AuthenticatedRequest, MiddlewareNext } from '@shared/types/http.types';

export const protect = async (
  req: IncomingMessage, 
  res: ServerResponse, 
  next: MiddlewareNext
) => {
  const strategy = AuthFactory.getStrategy();
  const user = await strategy.authenticate(req, res);

  if (!user) {
    logger.warn(`🚫 Unauthorized access attempt: ${req.method} ${req.url}`);
    return ResponseUtil.error(res, 'Unauthorized: Access Denied', 401);
  }

  // Type-safe attachment
  (req as AuthenticatedRequest).user = user;
  logger.debug(`🔑 Authenticated User: ${user.id}`);
  
  return await next();
};

export const authorize = (...roles: string[]) => {
  return async (req: AuthenticatedRequest, res: ServerResponse, next: MiddlewareNext) => {
    const user = req.user;

    if (!user || !roles.includes(user.role)) {
      logger.warn(`🚫 Forbidden: User ${user?.id} with role ${user?.role} attempted to access restricted route ${req.url}`);
      return ResponseUtil.error(res, 'Forbidden: Insufficient permissions', 403);
    }

    return await next();
  };
};
