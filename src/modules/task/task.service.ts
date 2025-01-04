import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Cache } from 'cache-manager';
import { isBoolean, isNotEmpty, isNumber } from 'class-validator';
import { ErroBase } from 'src/exceptions/error_base';
import { NotFound } from 'src/exceptions/not_found';
import {
  PaginatedResult,
  PaginateFunction,
  paginator,
  PrismaService,
} from 'src/prisma/prisma.service'; // Adjust import path as needed
import { patternNoScript } from 'src/shared/constants/regex_patterns';
import { DateFormatter } from 'src/shared/formatters/date.formatter';
import { CreateTaskDto } from './dto/task.dto';
import { Task } from './entities/task.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class TaskService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private readonly userService: UserService,
  ) {}

  formatterDate = DateFormatter;

  /**
   * Cria uma nova tarefa no banco de dados.
   *
   * @param {CreateTaskDto} createTaskDto - Os dados para salvar no banco.
   * @return {Promise<Task>} Devolve uma promise para a tarefa criada.
   * @throws {Error} Ou um erro se tiver algo errado.
   */
  @ApiBody({ description: 'Cria uma nova tarefa.', type: CreateTaskDto })
  async create(createTaskDto: CreateTaskDto) {
    const { nome, objetivo, responsavelId } = createTaskDto;
    await this.validaDataTask(createTaskDto);
    try {
      return await this.prisma.task.create({
        data: {
          nome,
          objetivo,
          concluido: false,
          responsavel: { connect: { id: responsavelId } },
          criado_em: this.formatterDate.format(new Date()),
          alterado_em: this.formatterDate.format(new Date()),
        },
      });
    } catch (error) {
      throw new Error(`Failed to create task: ${error.message}`);
    }
  }

  /**
   * Valida os dados de uma nova tarefa.
   *
   * @param {CreateTaskDto} createTaskDto - Valida os dados enviado pelo usuário.
   * @return {void} retorno vazio.
   */
  async validaDataTask(createTaskDto: CreateTaskDto) {
    const { nome, objetivo, responsavelId, concluido } = createTaskDto;
    const user = await this.userService.findOne(responsavelId);
    if (
      !isNotEmpty(nome) ||
      !isNotEmpty(objetivo) ||
      !isBoolean(concluido) ||
      !user
    ) {
      throw new BadRequestException(
        'Algum dado é inválido, ou não foi informado',
      );
    }
    if (patternNoScript.test(nome) || patternNoScript.test(objetivo)) {
      throw new BadRequestException(
        'Provavelmente o objetivo ou nome da tarefa possui tag HTML scripts',
      );
    }

    return false;
  }

  /**
   * Retorna todas as tarefas com base nos filtros.
   *
   * @param {Object} filters - Os filtros a serem aplicados.
   * @param {Prisma.UserWhereInput} [filters.where] - As condições para filtrar as tarefas.
   *   Este é um parâmetro opcional. Se fornecido, será usado para filtrar as tarefas
   * com base nas condições especificadas no objeto where.
   * @param {Prisma.UserOrderByWithRelationInput} [filters.orderBy] - O número da página dos resultados.
   *   Este é um parâmetro opcional. Se fornecido, será usado para especificar o número da página
   * dos resultados que devem ser retornados.
   * @param {number} [filters.page] - O número da página dos resultados.
   *   Este é um parâmetro opcional. Se fornecido, será usado para especificar o número da página
   * dos resultados que devem ser retornados.
   * @param {number} [filters.perPage] - O número de itens por página.
   *   Este é um parâmetro opcional. Se fornecido, será usado para especificar o número de itens
   * por página que deverá ser retornada.
   * @return {Promise<PaginatedResult<Task>>} Uma promessa que resulta em um resultado paginado de tarefas.
   * A promessa será resolvida para um objeto contendo as tarefas que correspondem aos filtros,
   * junto com metadados sobre a paginação, como o número total de tarefas,
   * o número da página atual, o número de itens por página e os URLs da página anterior
   * e próximas páginas, se existirem.
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
  }): Promise<PaginatedResult<Task>> {
    const itemChached = await this.cacheService.get('tasks');
    console.log(itemChached);
    if (itemChached !== undefined || null) {
      return itemChached as PaginatedResult<Task>;
    } else {
      // Create a paginator function with the specified number of items per page.
      const paginate: PaginateFunction = paginator({ perPage: perPage });
      const result: PaginatedResult<Task> = await paginate(
        this.prisma.task,
        {
          where,
          orderBy,
        },
        {
          page,
        },
      );
      await this.cacheService.set('tasks', result, 0);
      const itemChached = await this.cacheService.get('tasks');
      console.log(itemChached);

      if (itemChached) {
        console.log('data set to cache', itemChached);
        return itemChached as PaginatedResult<Task>;
      }

      // Call the paginator function with the Prisma task model and the filters provided.
      return result;
    }
  }

  /**
   * Retorna uma tarefa especifica pelo id.
   *
   * @param {number} id - O id que deve ser usado para encontrar a tarefa.
   * @return {Promise<Task>} Devolve uma promessa com uma Task.
   * @throws {Error} Lança um erro se tiver algo de errado.
   */
  async findOne(id: number) {
    if (id === undefined || !isNumber(id)) {
      throw new BadRequestException('ID inválido');
    }
    try {
      const task = await this.prisma.task.findUnique({ where: { id } });
      console.log(task);
      return task;
    } catch (error) {
      throw new Error(`Failed to fetch task with ID ${id}: ${error.message}`);
    }
  }

  /**
   * Atualiza uma tarefa no banco de dados pelo ID.
   *
   * @param {number} id - O id da tarefa que vai ser atualizado.
   * @param {UpdateTaskDto} updateTaskDto - O conteúdo que vai ser atualizado.
   * @return {Promise<Task>} Devolve uma promise com o resultado.
   */
  async update(id: number, updateTaskDto: CreateTaskDto) {
    const { nome, objetivo, concluido } = updateTaskDto;
    this.validaDataTask(updateTaskDto);
    try {
      const updatedTask = await this.prisma.task.update({
        where: { id },
        data: {
          nome,
          objetivo,
          concluido,
          alterado_em: this.formatterDate.format(new Date()),
        },
      });
      return updatedTask;
    } catch (error) {
      throw new ErroBase();
    }
  }

  async updateStatus(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });
    if (!task) {
      return new NotFound();
    }
    try {
      const updatedTask = await this.prisma.task.update({
        where: { id },
        data: {
          concluido: !task.concluido,
          alterado_em: this.formatterDate.format(new Date()),
        },
      });
      return updatedTask;
    } catch (error) {
      throw new Error(
        `Falha ao atualizar a tarefa com ID:${id}: ${error.message}`,
      );
    }
  }

  /**
   * Remove uma tarefa do banco de dados pelo ID.
   *
   * @param {number} id - O id da tarefa que vai ser removida.
   * @return {Promise<ReturnType>} Devolve uma promise com os dados da requisição.
   */
  async remove(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      return {
        message: `A tarefa com ID:${id} não foi encontrada.`,
        status: 404,
      };
    }

    try {
      const deletedTask = await this.prisma.task.delete({
        where: { id },
      });
      return { message: 'Tarefa removida com sucesso.', deletedTask };
    } catch (error) {
      throw new Error(
        `Falha ao remover a tarefa com ID:${id}: ${error.message}`,
      );
    }
  }
}
