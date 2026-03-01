import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UploadModule } from 'src/queue/processor/upload/upload.module';
import { TokenMiddleware } from 'src/middlewares/verifyToken';

@Module({
  controllers: [TransactionsController],
  imports: [SupabaseModule, PrismaModule, UploadModule,],
  providers: [TransactionsService],
})
export class TransactionsModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenMiddleware).forRoutes({
      path: 'transactions',
      method: RequestMethod.ALL,
    });
  }
}
