import { Module } from '@nestjs/common';
import { SendMailConsumer } from 'src/queue/job/sendmail-welcome.consumer';

@Module({
  imports: [],
  controllers: [],
  providers: [SendMailConsumer],
  exports: [SendMailConsumer],
})
export class MailModule {}
