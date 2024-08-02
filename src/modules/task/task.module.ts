import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TokenMiddleware } from 'src/middlewares/verifyToken';
import { ValidateDateRequestsMiddleware } from 'src/middlewares/validateDateRequests';

@Module({
  imports: [PrismaModule],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenMiddleware, ValidateDateRequestsMiddleware).forRoutes({
      path: 'task',
      method: RequestMethod.ALL,
    });
  }
}
