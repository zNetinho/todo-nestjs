import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { SendfileModule } from 'src/shared/sendfile/sendfile.module';
import { UploadModule } from 'src/queue/processor/upload/upload.module';
import { MailModule } from 'src/queue/processor/mail/mail.module';
import { ValidateDateRequestsMiddleware } from 'src/middlewares/validateDateRequests';
import { TokenMiddleware } from 'src/middlewares/verifyToken';

@Module({
  imports: [
    PrismaModule,
    SupabaseModule,
    SendfileModule,
    UploadModule,
    MailModule,
  ],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenMiddleware, ValidateDateRequestsMiddleware)
      .forRoutes(
        { path: 'user', method: RequestMethod.GET },
        { path: 'user', method: RequestMethod.PUT },
        { path: 'user', method: RequestMethod.PATCH },
        { path: 'user', method: RequestMethod.DELETE },
        { path: 'user', method: RequestMethod.OPTIONS },
        { path: 'user', method: RequestMethod.HEAD },
        // inclua variações de rota se necessário:
        { path: 'user/:id', method: RequestMethod.GET },
        { path: 'user/:id', method: RequestMethod.PUT },
        { path: 'user/:id', method: RequestMethod.PATCH },
        { path: 'user/:id', method: RequestMethod.DELETE },
      );
  }
}
