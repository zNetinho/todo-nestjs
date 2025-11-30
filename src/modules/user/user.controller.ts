import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { CacheTTL } from '@nestjs/cache-manager';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'first_name', maxCount: 1 },
      { name: 'last_name', maxCount: 1 },
      { name: 'avatar', maxCount: 1 },
      { name: 'email', maxCount: 1 },
      { name: 'password', maxCount: 1 },
    ]),
  )
  @Post()
  @ApiOperation({ summary: 'Criar um usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Verifique o token JWT da request.' })
  @ApiResponse({ status: 406, description: 'Dados inválidos. Verifique os dados enviados.' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor.' })
  async create(
    @Body() createUserDto: User,
    @Req() req: Request,
    @UploadedFiles()
    files: {
      avatar?: Express.Multer.File;
    },
  ) {
    return this.userService.create(createUserDto, files.avatar[0]);
  }

  @Get()
  @ApiOperation({ summary: 'Busca todos usuários' })
  @ApiResponse({ status: 200, description: 'Lista de usuários retornada com sucesso.' })
  @ApiResponse({ status: 401, description: 'Verifique o token JWT da request.' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor.' })
  @CacheTTL(60)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca usuário por ID' })
  @ApiResponse({ status: 200, description: 'Usuário retornado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Verifique o token JWT da request.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor.' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'first_name', maxCount: 1 },
      { name: 'last_name', maxCount: 1 },
      { name: 'avatar', maxCount: 1 },
      { name: 'email', maxCount: 1 },
      { name: 'password', maxCount: 1 },
    ]),
  )
  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza info do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Verifique o token JWT da request.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor.' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFiles() files: { avatar?: Express.Multer.File;},) {
    console.log("Endpoint", updateUserDto)
    console.log("avatar", files)
    if (!updateUserDto) {
      throw new Error('No data provided for update');
    }

    return this.userService.update(id, updateUserDto, files.avatar[0]);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um usuário' })
  @ApiResponse({ status: 200, description: 'Usuário removido com sucesso.' })
  @ApiResponse({ status: 401, description: 'Verifique o token JWT da request.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor.' })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
