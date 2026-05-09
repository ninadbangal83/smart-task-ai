import { Request, Response, NextFunction } from 'express';
import { UserService } from '@domain/services/user.service';
import { ResponseUtil } from '@shared/utils/response.util';
import { AuthenticatedRequest } from '@shared/types/http.types';

export class UserController {
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const requester = (req as AuthenticatedRequest).user;
      const user = await UserService.getUserById(requester.id, requester);
      ResponseUtil.success(res, user);
    } catch (err: any) {
      next(err);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const requester = (req as AuthenticatedRequest).user;
      const data = req.body;
      const updated = await UserService.updateUser(requester.id, requester, data);
      ResponseUtil.success(res, updated);
    } catch (err: any) {
      next(err);
    }
  }

  static async deleteProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const requester = (req as AuthenticatedRequest).user;
      await UserService.deleteUser(requester.id, requester);
      ResponseUtil.success(res, null, 204);
    } catch (err: any) {
      next(err);
    }
  }

  // Admin Only Methods
  static async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserService.getAllUsers();
      ResponseUtil.success(res, users);
    } catch (err: any) {
      next(err);
    }
  }

  static async adminUpdateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const requester = (req as AuthenticatedRequest).user;
      const { id } = req.params;
      const data = req.body;
      const updated = await UserService.updateUser(id, requester, data);
      ResponseUtil.success(res, updated);
    } catch (err: any) {
      next(err);
    }
  }

  static async adminDeleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const requester = (req as AuthenticatedRequest).user;
      const { id } = req.params;
      await UserService.deleteUser(id, requester);
      ResponseUtil.success(res, null, 204);
    } catch (err: any) {
      next(err);
    }
  }
}
