import { Router } from 'express';
import { TaskController } from '@api/controllers/task.controller';
import { protect } from '@api/middleware/auth.middleware';

const router = Router();

// Protect all task routes
router.use(protect);

router.get('/', TaskController.getAll);
router.post('/', TaskController.create);
router.get('/:id', TaskController.getById);
router.put('/:id', TaskController.update);
router.delete('/:id', TaskController.delete);

export { router as taskRouter };
