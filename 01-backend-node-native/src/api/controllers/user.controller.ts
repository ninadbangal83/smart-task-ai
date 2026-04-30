import { IncomingMessage, ServerResponse } from 'http';
import { UserService } from '@domain/services/user.service';
import { ResponseUtil } from '@shared/utils/response.util';
import { RequestUtil } from '@shared/utils/request.util';
import { AuthenticatedRequest } from '@shared/types/http.types';

export class UserController {
  static async getProfile(req: IncomingMessage, res: ServerResponse) {
    const requester = (req as AuthenticatedRequest).user;
    const user = await UserService.getUserById(requester.id, requester);
    ResponseUtil.success(res, user);
  }

  static async updateProfile(req: IncomingMessage, res: ServerResponse) {
    const requester = (req as AuthenticatedRequest).user;
    const data = await RequestUtil.getBody<Record<string, any>>(req);
    const updated = await UserService.updateUser(requester.id, requester, data);
    ResponseUtil.success(res, updated);
  }

  static async deleteProfile(req: IncomingMessage, res: ServerResponse) {
    const requester = (req as AuthenticatedRequest).user;
    await UserService.deleteUser(requester.id, requester);
    ResponseUtil.success(res, null, 204);
  }

  // Admin Only Methods
  static async getAllUsers(req: IncomingMessage, res: ServerResponse) {
    const users = await UserService.getAllUsers();
    ResponseUtil.success(res, users);
  }

  static async adminUpdateUser(req: IncomingMessage, res: ServerResponse, id: string) {
    const requester = (req as AuthenticatedRequest).user;
    const data = await RequestUtil.getBody<Record<string, any>>(req);
    const updated = await UserService.updateUser(id, requester, data);
    ResponseUtil.success(res, updated);
  }

  static async adminDeleteUser(req: IncomingMessage, res: ServerResponse, id: string) {
    const requester = (req as AuthenticatedRequest).user;
    await UserService.deleteUser(id, requester);
    ResponseUtil.success(res, null, 204);
  }
}
