import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bullmq';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import type { RedisClientOptions } from 'redis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { TaskModule } from './modules/task/task.module';
import { UserModule } from './modules/user/user.module';
import { PrismaService } from './prisma/prisma.service';
import { SendfileModule } from './shared/sendfile/sendfile.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TaskModule,
    UserModule,
    AuthModule,
    SendfileModule,
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        keyPrefix: 'to-do',
      },
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAILERMODULE_HOST,
        port: Number(process.env.MAILERMODULE_PORT),
        auth: {
          user: process.env.MAILERMODULE_USER,
          pass: process.env.MAILERMODULE_PASS,
        },
      },
    }),
    BullModule.registerQueue({
      name: 'sendmail-welcome',
    }),
    BullModule.registerQueue({
      name: 'uploadfile-queue',
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      isGlobal: true,
      ttl: 60 * 1000, // 1 min
      max: 60,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
