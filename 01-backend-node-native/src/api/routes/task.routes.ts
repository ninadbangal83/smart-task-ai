import { IncomingMessage, ServerResponse } from 'http';
import { TaskController } from '@api/controllers/task.controller';

export const handleTaskRoutes = async (req: IncomingMessage, res: ServerResponse) => {
  const { method, url } = req;

  if (url === '/api/tasks' && method === 'GET') {
    return await TaskController.getAll(req, res);
  }

  if (url === '/api/tasks' && method === 'POST') {
    return await TaskController.create(req, res);
  }

  // If no match is found in this specific route file, return false
  return false;
};
