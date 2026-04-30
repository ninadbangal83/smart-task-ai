import { IncomingMessage, ServerResponse } from 'http';
import { ResponseUtil } from '@shared/utils/response.util';
import { AuthFactory } from './auth/auth.factory';

export const protect = async (
  req: IncomingMessage, 
  res: ServerResponse, 
  next: () => Promise<any>
) => {
  const strategy = AuthFactory.getStrategy();
  const user = await strategy.authenticate(req, res);

  if (!user) {
    return ResponseUtil.error(res, 'Unauthorized: Access Denied', 401);
  }

  // Attach user info to request
  (req as any).user = user;
  
  return await next();
};
