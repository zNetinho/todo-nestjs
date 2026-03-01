import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionsService } from './transactions.service';

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
    @UploadedFiles() files: { proof_url?: MulterField;}) {
    const urlProof = files?.proof_url?.[0] ?? "undefined";
    const transaction =
      await this.transactionsService.create(createTransactionDto, urlProof);
    return res.status(201).json(transaction);
  }

  @Get()
  //a rota precisa de um token JWT válido para acessar os dados, caso contrário, retornará um erro 404 (Not Found) para evitar exposição de informações sensíveis.
  @ApiBearerAuth()

  @ApiOperation({ summary: 'Recupera uma lista paginada de transações, com suporte a filtragem por usuário.' })
  @ApiQuery({ name: 'page', required: false, description: 'Número da página para paginação (padrão: 1)' })
  @ApiQuery({ name: 'perPage', required: false, description: 'Número de itens por página para paginação (padrão: 10)' })
  @ApiQuery({ name: 'userId', required: false, description: 'ID do usuário para filtrar as transações' })
  @ApiResponse({ status: 200, description: 'Lista de transações recuperada com sucesso.', example: {
    "data": [
      {
        "id": "1234567890",
        "user_id": "user123",
        "name_bill": "Conta de Luz",
        "type_transaction": "EXPENSE",
        "category": "Casa",
        "amount": 150.00,
        "description": "Conta de luz do mês de janeiro",
        "proof_url": "/uploads/proof_1234567890.png",
        "location": "https://supabase.com/proofs/123e4567-e89b-12d3-a456-426614174000.png",
        "date": "2024-01-15T00:00:00Z"
      },
      {
        "id": "0987654321",
        "user_id": "user123",
        "name_bill": "Salário",
        "type_transaction": "DEPOSIT",
        "category": "MONTHLY",
        "amount": 5000.00,
        "description": "Salário do mês de janeiro",
        "proof_url": "https://supabase.com/proofs/123e4567-e89b-12d3-a456-426614174000.png",
        "location": "Empresa XYZ, São Paulo, SP",
        "date": "2024-01-30T00:00:00Z"
      }
    ],
    "total": 1,
    "page": 1,
    "perPage": 10
  }})
  @ApiResponse({ status: 400, description: 'Requisição incorreta, verifique os parâmetros de consulta.' })
  @ApiResponse({ status: 401, description: 'Não autorizado. Verifique o token JWT' })
  @ApiResponse({ status: 404, description: 'Não encontrado.', example: [] })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor.' })

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
  @ApiOperation({ summary: 'Recupera uma transação específica pelo ID.' })
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza os detalhes de uma transação existente.' })
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(id, updateTransactionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma transação do banco de dados.' })
  remove(@Param('id') id: string, @Res() res) {
    const transaction = this.transactionsService.remove(id);
    if (!transaction) { 
      return res.status(404).json({ message: 'Transaction not found' })
    }
    return res.status(204).json(transaction)
  }
}
