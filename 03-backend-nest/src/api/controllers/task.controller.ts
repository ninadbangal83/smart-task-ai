import { Controller, Get, Post, Put, Delete, Body, Param, Req, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { TaskService } from '@domain/services/task.service';
import { ResponseUtil } from '@shared/utils/response.util';
import { AuthGuard } from '../guards/auth.guard';
import type { AuthenticatedRequest } from '@shared/types/http.types';

@Controller('api/tasks')
@UseGuards(AuthGuard)
export class TaskController {
  @Get()
  async getAll(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    const tasks = await TaskService.getAllTasks(req.user);
    ResponseUtil.success(res, tasks);
  }

  @Post()
  async create(@Req() req: AuthenticatedRequest, @Body() body: any, @Res() res: Response) {
    const task = await TaskService.createTask({ ...body, userId: req.user.id });
    ResponseUtil.success(res, task, 201);
  }

  @Get(':id')
  async getById(@Req() req: AuthenticatedRequest, @Param('id') id: string, @Res() res: Response) {
    const task = await TaskService.getTaskById(id, req.user);
    ResponseUtil.success(res, task);
  }

  @Put(':id')
  async update(@Req() req: AuthenticatedRequest, @Param('id') id: string, @Body() body: any, @Res() res: Response) {
    const updated = await TaskService.updateTask(id, req.user, body);
    ResponseUtil.success(res, updated);
  }

  @Delete(':id')
  async delete(@Req() req: AuthenticatedRequest, @Param('id') id: string, @Res() res: Response) {
    await TaskService.deleteTask(id, req.user);
    ResponseUtil.success(res, null, 204);
  }
}
