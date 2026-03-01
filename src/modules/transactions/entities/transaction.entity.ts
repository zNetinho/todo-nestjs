import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { DateFormatter } from 'src/shared/formatters/date.formatter';

@Injectable()
export class Transaction {
  @ApiProperty({ description: 'Unique identifier for the transaction.' })
  @IsNotEmpty()
  @IsString({ message: 'The id must be a string.' })
  id: string;

  @ApiProperty({ description: 'Identifica o usuário associado à transação.' })
  @IsNotEmpty()
  @IsString({ message: 'O user_id must be a string.' })
  user_id: string;

  @ApiProperty({ description: 'Nome da conta ou descrição da transação.' })
  @IsNotEmpty()
  @IsString({ message: 'O name_bill must be a string.' })
  name_bill: string;

  @ApiProperty({ description: 'Tipo da transação, podendo ser "EXPENSE" ou "DEPOSIT".' })
  @IsNotEmpty()
  type_transaction: 'EXPENSE' | 'DEPOSIT';

  @ApiProperty({ description: 'Categoria da transação, podendo ser "NONSENSE", "ESSENTIAL", "NECESSARY" ou "MONTHLY_BILL".' })
  @IsNotEmpty()
  category: 'NONSENSE' | 'ESSENTIAL' | 'NECESSARY' | 'MONTHLY_BILL';

  @ApiProperty({ description: 'Valor monetário da transação.' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Descrição detalhada da transação.' })
  @IsNotEmpty()
  @IsString({ message: 'A description must be a string.' })
  description: string;

  @ApiProperty({ description: 'URL de comprovação da transação, se aplicável. Imagem upada no Supabase/storage' })
  @IsOptional()
  @IsString({ message: 'The proof_url must be a string.' })
  proof_url: string;

  @ApiProperty({ description: 'Localização associada à transação, se aplicável.' })
  @IsOptional()
  @IsString({ message: 'The location must be a string.' })
  location: string;

  @ApiProperty({ description: 'Data de criação da transação.' })
  @IsNotEmpty()
  @IsString({ message: 'The created_at must be a string.' })
  created_at: string;

  @ApiProperty({ description: 'Data da transação.' })
  @IsNotEmpty()
  date: string;

  formatterDate = DateFormatter;

  constructor(
    id: string,
    user_id: string,
    name_bill: string,
    type_transaction: 'EXPENSE' | 'DEPOSIT',
    category: 'NONSENSE' | 'ESSENTIAL' | 'NECESSARY' | 'MONTHLY_BILL',
    amount: number,
    description: string,
    date: string,
    proof_url?: string,
    location?: string,
  ) {
    this.id = id;
    this.user_id = user_id;
    this.name_bill = name_bill;
    this.type_transaction = type_transaction;
    this.category = category;
    this.amount = amount;
    this.description = description;
    this.proof_url = proof_url;
    this.location = location;
    this.created_at = this.formatterDate.format(new Date());
    this.date = this.formatterDate.format(new Date(date));
  }

  modifyDate(date: string) {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new Error('Invalid date format');
    }
    this.date = this.formatterDate.format(parsedDate);
  }
}
