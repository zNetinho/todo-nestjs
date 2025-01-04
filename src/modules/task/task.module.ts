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
import { UserModule } from '../user/user.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { RedisClientOptions } from 'redis';

@Module({
  imports: [PrismaModule, UserModule],
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
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      ttl: 60, // 1 min
      max: 60,
    });
  }
}
