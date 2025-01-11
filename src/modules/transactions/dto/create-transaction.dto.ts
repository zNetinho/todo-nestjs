import { IsDateString } from "class-validator";
import { DateFormatter } from "src/shared/formatters/date.formatter";

export class CreateTransactionDto {
  id: string;
  user_id: string;
  name_bill: string;
  type_transaction: 'EXPENSE' | 'DEPOSIT';
  category: 'NONSENSE' | 'ESSENTIAL' | 'NECESSARY' | 'MONTHLY_BILL';
  amount: number;
  description: string;
  created_at: Date;
  date: string;
  proof_url: string;
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
