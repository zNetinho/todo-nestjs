import { ApiProperty } from "@nestjs/swagger";
import { IsDateString } from "class-validator";
import { DateFormatter } from "src/shared/formatters/date.formatter";

export class CreateTransactionDto {

  @ApiProperty({ 
    description: 'Identifica o usuário associado à transação.',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string;
  @ApiProperty({ 
    description: 'Identifica o usuário associado à transação.',
    example: 'cmiluk2xq0000qi7ug5ls0oa4'
  })
  user_id: string;
  @ApiProperty({ 
    description: 'Nome da conta ou descrição da transação.',
    example: 'Conta de luz'
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
  created_at: Date;
  @ApiProperty({ 
    description: 'Data da transação.',
    example: '2023-08-15T10:30:00Z'
  })
  date: string;
  @ApiProperty({ 
    description: 'URL de comprovação da transação, se aplicável. Imagem upada no Supabase/storage',
    example: 'https://supabase.com/proofs/123e4567-e89b-12d3-a456-426614174000.png'
  })
  proof_url: string;
  @ApiProperty({ 
    description: 'Localização associada à transação, se aplicável.',
    example: 'Av. Paulista, 1000 - São Paulo, SP'
  })
  location: string;
  
  constructor(
    user_id: string,
    name_bill: string,
    type_transaction: 'EXPENSE' | 'DEPOSIT',
    category: 'NONSENSE' | 'ESSENTIAL' | 'NECESSARY' | 'MONTHLY_BILL',
    amount: number,
    description: string,
    created_at: Date,
    date: string,
    proof_url?: string,
    location?: string,
  ) {
    this.user_id = user_id;
    this.name_bill = name_bill;
    this.type_transaction = type_transaction;
    this.category = category;
    this.amount = amount;
    this.description = description;
    this.created_at = created_at;
    this.date =  date;
    if (proof_url) {
      this.proof_url = proof_url;
    }
    if (location) {
      this.location = location;
    }
  }
}
