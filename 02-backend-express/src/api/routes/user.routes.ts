import { Router } from 'express';
import { UserController } from '@api/controllers/user.controller';
import { protect, authorize } from '@api/middleware/auth.middleware';

const router = Router();

// 1. Profile Routes (Authenticated Users)
router.get('/users/profile', protect, UserController.getProfile);
router.put('/users/profile', protect, UserController.updateProfile);
router.delete('/users/profile', protect, UserController.deleteProfile);

// 2. Admin Only Routes
router.get('/admin/users', protect, authorize('admin'), UserController.getAllUsers);
router.put('/admin/users/:id', protect, authorize('admin'), UserController.adminUpdateUser);
router.delete('/admin/users/:id', protect, authorize('admin'), UserController.adminDeleteUser);

export { router as userRouter };
