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
  UploadedFiles,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UploadFileConsumer } from 'src/queue/job/uploadfile.consumer';

@ApiTags('Transactions')
@Controller('transactions')
@UseInterceptors(CacheInterceptor) // define o tratamento de cache usando configs do module
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Registra uma nova transação no banco.' })
  @ApiResponse({ status: 201, description: 'Transação criada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Não autorizado. Verifique o token JWT' })
  @ApiResponse({ status: 406, description: 'Requisição incorreta, verifique os dados.' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor.' })
  @UseInterceptors(
      FileFieldsInterceptor([
        { name: 'user_id', maxCount: 1 },
        { name: 'name_bill', maxCount: 1 },
        { name: 'type_transaction', maxCount: 1 },
        { name: 'category', maxCount: 1 },
        { name: 'amount', maxCount: 1 },
        { name: 'description', maxCount: 1 },
        { name: 'proof_url', maxCount: 1 },
        { name: 'location', maxCount: 1 },
        { name: 'date', maxCount: 1 },
      ]),
    )
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Res() res,
    @UploadedFiles() files: { proof_url?: Express.Multer.File;}) {
    const transaction =
      await this.transactionsService.create(createTransactionDto, files.proof_url?.[0]);
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
