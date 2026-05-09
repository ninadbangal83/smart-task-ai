import { Controller, Post, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from '@domain/services/auth.service';
import { ResponseUtil } from '@shared/utils/response.util';
import type { CreateUserDto, LoginDto } from '@domain-types/user.types';
import { BadRequestError } from '@shared/errors/app.error';

@Controller('api/auth')
export class AuthController {
  @Post('register')
  async register(@Body() body: CreateUserDto, @Res() res: Response) {
    const result = await AuthService.register(body, res);
    ResponseUtil.success(res, result, 201);
  }

  @Post('login')
  async login(@Body() body: LoginDto, @Res() res: Response) {
    const { email, password } = body;
    
    if (!email || !password) {
      throw new BadRequestError('Email and password are required');
    }

    const result = await AuthService.login(email, password, res);
    ResponseUtil.success(res, result);
  }
}
