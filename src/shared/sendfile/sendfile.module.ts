import { Module } from '@nestjs/common';
import { SendfileController } from './sendfile.controller';
import { SendfileService } from './sendfile.service';

@Module({
  imports: [],
  exports: [SendfileService],
  controllers: [SendfileController],
  providers: [SendfileService],
})
export class SendfileModule {}
