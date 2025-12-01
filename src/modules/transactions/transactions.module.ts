import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UploadModule } from 'src/queue/processor/upload/upload.module';

@Module({
  controllers: [TransactionsController],
  imports: [SupabaseModule, PrismaModule, UploadModule,],
  providers: [TransactionsService],
})
export class TransactionsModule {}
