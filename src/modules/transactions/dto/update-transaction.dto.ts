import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionDto } from './create-transaction.dto';
import { IsOptional } from 'class-validator';
import { DateFormatter } from 'src/shared/formatters/date.formatter';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
  id: string;
  name_bill: string;
  type_transaction: 'EXPENSE' | 'DEPOSIT';
  category: 'NONSENSE' | 'ESSENTIAL' | 'NECESSARY' | 'MONTHLY_BILL';
  amount: number;
  description: string;
  @IsOptional()
  proof_url: string;
  @IsOptional()
  location: string;
  @IsOptional()
  date: string;

  super(
    name_bill: string,
    type_transaction: 'EXPENSE' | 'DEPOSIT',
    category: 'NONSENSE' | 'ESSENTIAL' | 'NECESSARY' | 'MONTHLY_BILL',
    amount: number,
    description: string,
    proof_url?: string,
    location?: string,
    date?: string,
  ) {
    this.name_bill = name_bill;
    this.type_transaction = type_transaction;
    this.category = category;
    this.amount = amount;
    this.description = description;
    if (proof_url) {
      this.proof_url = proof_url;
    }
    if (location) {
      this.location = location;
    }
    if (date) {
      this.date = DateFormatter.format(new Date(date));
    }
  }
}
