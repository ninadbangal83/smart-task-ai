import { IncomingMessage, ServerResponse } from 'http';
import { AuthController } from '@api/controllers/auth.controller';
import { runMiddleware } from '@shared/utils/middleware.util';

export const handleAuthRoutes = async (req: IncomingMessage, res: ServerResponse) => {
  const { method, url = '' } = req;

  if (url === '/api/auth/register' && method === 'POST') {
    return await runMiddleware(req, res, [], () => AuthController.register(req, res));
  }

  if (url === '/api/auth/login' && method === 'POST') {
    return await runMiddleware(req, res, [], () => AuthController.login(req, res));
  }

  return false;
};
