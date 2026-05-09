import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthFactory } from '../middleware/auth/auth.factory';
import { AuthenticatedRequest } from '@shared/types/http.types';
import { Response } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest<AuthenticatedRequest>();
    const res = httpContext.getResponse<Response>();

    try {
      const strategy = AuthFactory.getStrategy();
      const user = await strategy.authenticate(req, res);
      
      if (!user) {
        return false;
      }

      req.user = user;
      return true;
    } catch (err) {
      return false;
    }
  }
}
