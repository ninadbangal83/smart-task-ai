import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@domain/services/auth.service';
import { ResponseUtil } from '@shared/utils/response.util';
import { CreateUserDto, LoginDto } from '@domain-types/user.types';
import { BadRequestError } from '@shared/errors/app.error';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as CreateUserDto;
      const result = await AuthService.register(body, res);
      ResponseUtil.success(res, result, 201);
    } catch (err: any) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body as LoginDto;
      
      if (!email || !password) {
        throw new BadRequestError('Email and password are required');
      }

      const result = await AuthService.login(email, password, res);
      ResponseUtil.success(res, result);
    } catch (err: any) {
      next(err);
    }
  }
}
