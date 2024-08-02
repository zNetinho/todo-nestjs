import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UploadFileConsumer } from 'src/queue/job/uploadfile.consumer';
import { SendfileModule } from 'src/shared/sendfile/sendfile.module';

@Module({
  imports: [SendfileModule, PrismaModule],
  exports: [UploadFileConsumer],
  providers: [UploadFileConsumer],
})
export class UploadModule {}
