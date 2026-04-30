import { IncomingMessage, ServerResponse } from 'http';
import { AuthUtil } from '@shared/utils/auth.util';
import { ResponseUtil } from '@shared/utils/response.util';

export const protect = async (
  req: IncomingMessage, 
  res: ServerResponse, 
  next: () => Promise<any>
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return ResponseUtil.error(res, 'Unauthorized: No token provided', 401);
  }

  const token = authHeader.split(' ')[1];
  const decoded = AuthUtil.verifyToken(token);

  if (!decoded) {
    return ResponseUtil.error(res, 'Unauthorized: Invalid or expired token', 401);
  }

  // Attach user info to request (Hack for Native Node)
  (req as any).user = decoded;
  
  return await next();
};
