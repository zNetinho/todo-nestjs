import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [TransactionsController],
  imports: [SupabaseModule, PrismaModule],
  providers: [TransactionsService],
})
export class TransactionsModule {}
