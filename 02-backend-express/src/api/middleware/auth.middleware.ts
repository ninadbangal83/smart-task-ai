import { Request, Response, NextFunction } from 'express';
import { ResponseUtil } from '@shared/utils/response.util';
import { AuthFactory } from './auth/auth.factory';
import { logger } from '@shared/utils/logger';
import { AuthenticatedRequest } from '@shared/types/http.types';

export const protect = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const strategy = AuthFactory.getStrategy();
    const user = await strategy.authenticate(req, res);

    if (!user) {
      logger.warn(`🚫 Unauthorized access attempt: ${req.method} ${req.originalUrl}`);
      return ResponseUtil.error(res, 'Unauthorized: Access Denied', 401);
    }

    // Type-safe attachment
    (req as AuthenticatedRequest).user = user;
    logger.debug(`🔑 Authenticated User: ${user.id}`);
    
    return next();
  } catch (err: any) {
    next(err);
  }
};

export const authorize = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as AuthenticatedRequest).user;

      if (!user || !roles.includes(user.role)) {
        logger.warn(`🚫 Forbidden: User ${user?.id} with role ${user?.role} attempted to access restricted route ${req.originalUrl}`);
        return ResponseUtil.error(res, 'Forbidden: Insufficient permissions', 403);
      }

      return next();
    } catch (err: any) {
      next(err);
    }
  };
};
