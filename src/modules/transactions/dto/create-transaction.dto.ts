export class CreateTransactionDto {
  id: string;
  user_id: string;
  name_bill: string;
  type_transaction: 'EXPENSE' | 'DEPOSIT';
  category: 'NONSENSE' | 'ESSENTIAL' | 'NECESSARY' | 'MONTHLY_BILL';
  amount: number;
  description: string;
  proof_url: string;
  location: string;
  created_at: Date;

  constructor(
    user_id: string,
    name_bill: string,
    type_transaction: 'EXPENSE' | 'DEPOSIT',
    category: 'NONSENSE' | 'ESSENTIAL' | 'NECESSARY' | 'MONTHLY_BILL',
    amount: number,
    description: string,
    created_at: Date,
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
    if (proof_url) {
      this.proof_url = proof_url;
    }
    if (location) {
      this.location = location;
    }
  }
}
