import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ApiTags } from '@nestjs/swagger';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@ApiTags('Transactions')
@Controller('transactions')
@UseInterceptors(CacheInterceptor) // define o tratamento de cache usando configs do module
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto, @Res() res) {
    const transaction =
      await this.transactionsService.create(createTransactionDto);
    return res.status(201).json(transaction);
  }

  @Get()
  @CacheTTL(60 * 1000 *10)
  @CacheKey('transactions')
  findAll(
    @Query('page') page = 1, // The value default is 1
    @Query('perPage') perPage = 10, // The value default perPage is 5
    @Query('userId') userId, // ID of Use for filter.
  ) {
    return this.transactionsService.findAll({ page, perPage, where: { user_id: userId } });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Res() res) {
    const transaction = this.transactionsService.remove(id);
    if (!transaction) { 
      return res.status(404).json({ message: 'Transaction not found' })
    }
    return res.status(204).json(transaction)
  }
}
