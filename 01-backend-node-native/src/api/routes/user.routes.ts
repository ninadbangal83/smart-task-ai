import { IncomingMessage, ServerResponse } from 'http';
import { UserController } from '@api/controllers/user.controller';
import { protect, authorize } from '@api/middleware/auth.middleware';
import { runMiddleware } from '@shared/utils/middleware.util';

export const handleUserRoutes = async (req: IncomingMessage, res: ServerResponse) => {
  const { method, url = '' } = req;

  // 1. Profile Routes
  if (url === '/api/users/profile') {
    if (method === 'GET') return await runMiddleware(req, res, [protect], () => UserController.getProfile(req, res));
    if (method === 'PUT') return await runMiddleware(req, res, [protect], () => UserController.updateProfile(req, res));
    if (method === 'DELETE') return await runMiddleware(req, res, [protect], () => UserController.deleteProfile(req, res));
  }

  // 2. Admin: Get All Users
  if (url === '/api/admin/users' && method === 'GET') {
    return await runMiddleware(req, res, [protect, authorize('admin')], () => UserController.getAllUsers(req, res));
  }

  // 3. Admin: Update/Delete Specific User
  const adminUserMatch = url.match(/^\/api\/admin\/users\/([a-zA-Z0-9]+)$/);
  if (adminUserMatch) {
    const userId = adminUserMatch[1];
    if (method === 'PUT') return await runMiddleware(req, res, [protect, authorize('admin')], () => UserController.adminUpdateUser(req, res, userId));
    if (method === 'DELETE') return await runMiddleware(req, res, [protect, authorize('admin')], () => UserController.adminDeleteUser(req, res, userId));
  }

  return false;
};
