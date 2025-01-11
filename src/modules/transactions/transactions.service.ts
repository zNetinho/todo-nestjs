import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { paginator, PrismaService, PaginateFunction, PaginatedResult } from 'src/prisma/prisma.service';
import { Prisma, Transactions } from '@prisma/client';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { DateFormatter } from 'src/shared/formatters/date.formatter';

@Injectable()
export class TransactionsService {
  constructor(@Inject(CACHE_MANAGER) private cacheService: Cache, private readonly prisma: PrismaService) { }

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
      date,
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
      date,
      proof_url,
      location,
    );

    try {
      return await this.prisma.transactions.create({
        data: {
          ...transaction,
          date: DateFormatter.format(new Date(createTransactionDto.date)),
        },
      });
    } catch (error) {
      throw new BadRequestException(`Failed to create task: ${error.message}`);
    }
  }

  /**
   * Retrieves all transactions from the database.
   *
   * @returns {Promise<CreateTransactionDto[]>} A promise that resolves to an array of CreateTransactionDto objects.
   * If no transactions are found, an empty array is returned.
   */
  async findAll({
    where,
    orderBy,
    page,
    perPage,
  }: {
    where?: Prisma.UserWhereInput | any;
    orderBy?: Prisma.UserOrderByWithRelationInput;
    page?: number;
    perPage?: number;
  }): Promise<PaginatedResult<Transactions>> {
    const itemChached = await this.cacheService.get('transactions'); // TODO: criar regra de cache das transações 0 = infinito.
    if (itemChached || itemChached !== undefined) { 
      return itemChached as PaginatedResult<Transactions>;
    }
    const paginate: PaginateFunction = paginator({ perPage: perPage });
    const result: PaginatedResult<Transactions> = await paginate(
      this.prisma.transactions,
      {
        where,
        orderBy,
      },
      {
        page,
      },
    );

    return result as PaginatedResult<Transactions>;
  }

  /**
   * Finds a single transaction by its unique identifier.
   * 
   * @param {string} id - The unique identifier of the transaction to find.
   * @returns {Promise<CreateTransactionDto>} A promise that resolves to the found transaction.
   * @throws {NotFoundException} If no transaction is found with the given identifier.
   */
  async findOne(id: string): Promise<any> {
    const transaction = await this.prisma.transactions.findUnique({
      where: { id }
    })
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }

  /**
   * Updates a transaction with the given ID using the provided updateTransactionDto.
   * 
   * @param {string} id - The ID of the transaction to update.
   * @param {UpdateTransactionDto} updateTransactionDto - The data transfer object containing the updated transaction information.
   * @returns {Promise<Transactions>} - A promise that resolves to the updated transaction.
   * @throws {Error} - Throws an error if the update operation fails.
   */
  async update(id: string, updateTransactionDto: UpdateTransactionDto): Promise<Transactions> {
    await this.validateInfo(updateTransactionDto)
    try {
      return await this.prisma.transactions.update({
        where: { id },
        data: {
          ...updateTransactionDto,
          date: DateFormatter.format(new Date(updateTransactionDto.date))
        }
      })
    } catch (error) {
      throw new Error(`Failed to update task: ${error.message}`);
    }
  }

  /**
   * Removes a transaction by its ID.
   * 
   * @param {string} id - The ID of the transaction to be removed.
   * @returns {Promise<CreateTransactionDto>} - The removed transaction data.
   * @throws {NotFoundException} - If the transaction with the given ID is not found.
   */
  async remove(id: string): Promise<any> {
    const transactionExclude = await this.prisma.transactions.delete({
      where: { id }
    })

    if (!transactionExclude) {
      throw new NotFoundException('Transaction for exclude not found')
    }

    return transactionExclude;
  }

  refreshTheData() {

  }

  /**
   * Validates the information of a transaction.
   * 
   * @param {CreateTransactionDto | UpdateTransactionDto} transaction - The transaction data to validate.
   * @returns {Promise<boolean>} - Returns false if validation passes, otherwise throws a BadRequestException.
   * 
   * @throws {BadRequestException} - If user_id is missing or not a string.
   * @throws {BadRequestException} - If user is not found.
   * @throws {BadRequestException} - If name_bill is missing, not a string, or less than 3 characters.
   * @throws {BadRequestException} - If description is missing, not a string, or less than 3 characters.
   * @throws {BadRequestException} - If amount is not a positive number.
   * @throws {BadRequestException} - If type_transaction is not "DEPOSIT" or "EXPENSE".
   */
  async validateInfo(transaction: CreateTransactionDto | UpdateTransactionDto) {
    const { name_bill, amount, type_transaction, description, user_id } =
      transaction;

    const user = await this.prisma.user.findUnique({ where: { id: user_id } })

    if (!user_id || typeof user_id !== 'string') {
      throw new BadRequestException('User id is required and must be a string');
    }
    if (user === null || user === undefined) {
      throw new BadRequestException('User not found');
    }
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

    return false;
  }
}
