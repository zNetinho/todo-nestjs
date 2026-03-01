import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionDto } from './create-transaction.dto';
import { IsOptional } from 'class-validator';
import { DateFormatter } from 'src/shared/formatters/date.formatter';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
  id: string;
  @ApiProperty({ 
    description: 'Identifica o usuário associado à transação.',
    example: 'cmiluk2xq0000qi7ug5ls0oa4'
  })
  name_bill: string;
  @ApiProperty({ 
    description: 'Tipo da transação, podendo ser "EXPENSE" ou "DEPOSIT".',
    example: 'EXPENSE'
  })
  type_transaction: 'EXPENSE' | 'DEPOSIT';
  @ApiProperty({ 
    description: 'Categoria da transação, podendo ser "NONSENSE", "ESSENTIAL", "NECESSARY" ou "MONTHLY_BILL".',
    example: 'ESSENTIAL'
  })
  category: 'NONSENSE' | 'ESSENTIAL' | 'NECESSARY' | 'MONTHLY_BILL';
  @ApiProperty({ 
    description: 'Valor monetário da transação.',
    example: 100.50
  })
  amount: number;
  @ApiProperty({ 
    description: 'Descrição detalhada da transação.', 
    example: 'Pagamento da conta de luz referente ao mês de agosto.'
  })
  description: string;
  @ApiProperty({
    description: 'Data de criação da transação.',
    example: '2023-08-15T10:30:00Z'
  })
  @IsOptional()
  proof_url: string;
  @ApiProperty({ 
    description: 'Localização associada à transação, se aplicável.',
    example: 'Av. Paulista, 1000 - São Paulo, SP'
  })
  @IsOptional()
  location: string;
  @ApiProperty({ 
    description: 'Data da transação.',
    example: '2023-08-15T10:30:00Z'
  })
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
