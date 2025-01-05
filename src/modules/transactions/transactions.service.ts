import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new transaction.
   *
   * @param {CreateTransactionDto} createTransactionDto - The data transfer object containing the details of the transaction to be created.
   * @returns {Promise<any>} - A promise that resolves to the created transaction.
   * @throws {Error} - Throws an error if the transaction creation fails.
   */
  async create(createTransactionDto: CreateTransactionDto) {
    const {
      name_bill,
      amount,
      type_transaction,
      description,
      category,
      created_at,
      user_id,
      proof_url,
      location,
    } = createTransactionDto;
    this.validateInfo(createTransactionDto);

    const transaction = new CreateTransactionDto(
      user_id,
      name_bill,
      type_transaction,
      category,
      amount,
      description,
      created_at,
      proof_url,
      location,
    );

    try {
      return await this.prisma.transactions.create({
        data: transaction,
      });
    } catch (error) {
      throw new Error(`Failed to create task: ${error.message}`);
    }
  }

  async findAll(): Promise<CreateTransactionDto[]> {
    const transactions = await this.prisma.transactions.findMany();
    if (!transactions) return [];
    return transactions;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }

  async validateInfo(transaction: CreateTransactionDto) {
    const { name_bill, amount, type_transaction, description, user_id } =
      transaction;

    if (!name_bill || typeof name_bill !== 'string' || name_bill.length < 3) {
      throw new BadRequestException(
        'Name of bill is required, must be a string and high than 3 characters',
      );
    }
    if (
      !description ||
      typeof description !== 'string' ||
      description.length < 3
    ) {
      throw new BadRequestException(
        'Description is required, must be a string and high than 3 characters',
      );
    }
    if (typeof amount !== 'number' || amount <= 0) {
      throw new BadRequestException(
        'Amount is required and must be a positive number',
      );
    }
    if (!['DEPOSIT', 'EXPENSE'].includes(type_transaction)) {
      throw new BadRequestException(
        'Type is required and must be either "DEPOSIT" or "EXPENSE"',
      );
    }

    if (!user_id || typeof user_id !== 'string') {
      throw new BadRequestException('User id is required and must be a string');
    }

    return false;
  }
}
