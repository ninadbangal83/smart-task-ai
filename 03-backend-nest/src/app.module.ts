import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthController } from './api/controllers/auth.controller';
import { TaskController } from './api/controllers/task.controller';
import { UserController } from './api/controllers/user.controller';

@Module({
  imports: [],
  controllers: [
    AppController,
    AuthController,
    TaskController,
    UserController,
  ],
  providers: [],
})
export class AppModule {}
