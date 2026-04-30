import { IncomingMessage, ServerResponse } from 'http';
import { TaskController } from '@api/controllers/task.controller';
import { protect } from '@api/middleware/auth.middleware';

export const handleTaskRoutes = async (req: IncomingMessage, res: ServerResponse) => {
  const { method, url = '' } = req;

  // 1. GET ALL: /api/tasks (Protected)
  if (url === '/api/tasks' && method === 'GET') {
    return await protect(req, res, async () => TaskController.getAll(req, res));
  }

  // 2. CREATE: /api/tasks (Protected)
  if (url === '/api/tasks' && method === 'POST') {
    return await protect(req, res, async () => TaskController.create(req, res));
  }

  // 3. GET/PUT/DELETE BY ID: /api/tasks/:id (Protected)
  const taskByIdMatch = url.match(/^\/api\/tasks\/([a-zA-Z0-9]+)$/);
  if (taskByIdMatch) {
    const taskId = taskByIdMatch[1];
    
    if (method === 'GET') return await protect(req, res, async () => TaskController.getById(req, res, taskId));
    if (method === 'PUT') return await protect(req, res, async () => TaskController.update(req, res, taskId));
    if (method === 'DELETE') return await protect(req, res, async () => TaskController.delete(req, res, taskId));
  }

  return false;
};
