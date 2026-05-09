import { Controller, Get, Put, Delete, Body, Param, Req, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { UserService } from '@domain/services/user.service';
import { ResponseUtil } from '@shared/utils/response.util';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import type { AuthenticatedRequest } from '@shared/types/http.types';

@Controller('api')
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
  @Get('users/profile')
  async getProfile(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    const requester = req.user;
    const user = await UserService.getUserById(requester.id, requester);
    ResponseUtil.success(res, user);
  }

  @Put('users/profile')
  async updateProfile(@Req() req: AuthenticatedRequest, @Body() body: any, @Res() res: Response) {
    const requester = req.user;
    const updated = await UserService.updateUser(requester.id, requester, body);
    ResponseUtil.success(res, updated);
  }

  @Delete('users/profile')
  async deleteProfile(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    const requester = req.user;
    await UserService.deleteUser(requester.id, requester);
    ResponseUtil.success(res, null, 204);
  }

  // Admin Only Methods
  @Get('admin/users')
  @Roles('admin')
  async getAllUsers(@Res() res: Response) {
    const users = await UserService.getAllUsers();
    ResponseUtil.success(res, users);
  }

  @Put('admin/users/:id')
  @Roles('admin')
  async adminUpdateUser(@Req() req: AuthenticatedRequest, @Param('id') id: string, @Body() body: any, @Res() res: Response) {
    const requester = req.user;
    const updated = await UserService.updateUser(id, requester, body);
    ResponseUtil.success(res, updated);
  }

  @Delete('admin/users/:id')
  @Roles('admin')
  async adminDeleteUser(@Req() req: AuthenticatedRequest, @Param('id') id: string, @Res() res: Response) {
    const requester = req.user;
    await UserService.deleteUser(id, requester);
    ResponseUtil.success(res, null, 204);
  }
}
