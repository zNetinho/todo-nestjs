import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { SendfileModule } from 'src/shared/sendfile/sendfile.module';
import { UploadModule } from 'src/queue/processor/upload/upload.module';
import { MailModule } from 'src/queue/processor/mail/mail.module';

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
export class UserModule {}
