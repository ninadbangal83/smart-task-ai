import { IncomingMessage, ServerResponse } from 'http';
import { AuthService } from '@domain/services/auth.service';
import { RequestUtil } from '@shared/utils/request.util';
import { ResponseUtil } from '@shared/utils/response.util';

export class AuthController {
  static async register(req: IncomingMessage, res: ServerResponse) {
    try {
      const body = await RequestUtil.getBody<any>(req);
      const result = await AuthService.register(body);
      ResponseUtil.success(res, result, 201);
    } catch (err: any) {
      AuthController.handleError(res, err);
    }
  }

  static async login(req: IncomingMessage, res: ServerResponse) {
    try {
      const { email, password } = await RequestUtil.getBody<any>(req);
      const result = await AuthService.login(email, password);
      ResponseUtil.success(res, result);
    } catch (err: any) {
      AuthController.handleError(res, err);
    }
  }

  private static handleError(res: ServerResponse, err: any) {
    const statusCode = err.statusCode || 500;
    ResponseUtil.error(res, err.message, statusCode);
  }
}
