import { IncomingMessage, ServerResponse } from 'http';
import { AuthService } from '@domain/services/auth.service';
import { RequestUtil } from '@shared/utils/request.util';
import { ResponseUtil } from '@shared/utils/response.util';
import { CreateUserDto, LoginDto } from '@domain-types/user.types';
import { BadRequestError } from '@shared/errors/app.error';

export class AuthController {
  static async register(req: IncomingMessage, res: ServerResponse) {
    const body = await RequestUtil.getBody<CreateUserDto>(req);
    const result = await AuthService.register(body, res);
    ResponseUtil.success(res, result, 201);
  }

  static async login(req: IncomingMessage, res: ServerResponse) {
    const { email, password } = await RequestUtil.getBody<LoginDto>(req);
    
    if (!email || !password) {
      throw new BadRequestError('Email and password are required');
    }

    const result = await AuthService.login(email, password, res);
    ResponseUtil.success(res, result);
  }
}
