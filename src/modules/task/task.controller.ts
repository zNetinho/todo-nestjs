import {
  CACHE_MANAGER,
  CacheInterceptor,
  CacheKey,
  CacheTTL,
} from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Cache } from 'cache-manager';
import { Response } from 'express';
import { NotFound } from 'src/exceptions/not_found';
import { CreateTaskDto } from './dto/task.dto';
import { TaskService } from './task.service';

@ApiTags('task')
@Controller('task')
@UseInterceptors(CacheInterceptor) // define o tratamento de cache usando configs do module
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Post()
  @ApiCreatedResponse({ description: 'A tarefa foi criada com sucesso.' })
  @ApiResponse({ status: 401, description: 'Ação inválida.' })
  /**
   * This method handles the creation of a new task. It takes in a CreateTaskDto
   * object which contains the data needed to create the task. It also takes in
   * a Response object which is used to send a response back to the client.
   *
   * The method first logs the createTaskDto object to the console. It then checks
   * if the task name and objective are both defined. If they are not, it sends
   * a response back to the client with a status of 406 and an error message.
   *
   * If the task name and objective are defined, it calls the create method of
   * the task service with the createTaskDto object. The create method returns
   * a Promise that resolves to the newly created task.
   *
   * If the task is successfully created, the method sends a response back to
   * the client with a status of 201 and a message indicating that the task was
   * created successfully. The task object is also included in the response.
   *
   * If there is an error creating the task, the method sends a response back to
   * the client with a status of 500 and an error message.
   *
   * @param {CreateTaskDto} createTaskDto - The data for creating the task.
   * @param {Response} res - The response object.
   * @return {Promise<void>} - A promise that resolves when the task is created successfully,
   * or rejects with an error response if there is an issue.
   */
  async create(@Body() createTaskDto: CreateTaskDto, @Res() res: Response) {
    // Call the create method of the task service with the createTaskDto object
    const task = await this.taskService.create(createTaskDto);

    // If the task is successfully created, send a response back to the client with a status of 201 and a message indicating that the task was created successfully
    if (task) {
      return res.status(201).json({
        message: 'Tarefa criada com sucesso',
        status: 201,
        task,
      });
    } else {
      // If there is an error creating the task, send a response back to the client with a status of 500 and an error message
      return res.status(500).json({
        message: 'Erro ao criar tarefa',
        status: 500,
      });
    }
  }

  // Apply object cache for route get, using URL as key
  @UseInterceptors(CacheInterceptor)
  @CacheKey('tasks')
  @CacheTTL(60 * 1000 * 30)
  @Get()
  /**
   * Return all task with filters.
   *
   * @param {number} page - number of page.
   * @param {number} perPage - number of itens.
   * @param {string} userId - the id responsable.
   * @return {Promise<PaginatedResult<Task>>} return a promise of all tasks.
   */
  async findAll(
    @Query('page') page = 1, // The value default is 1
    @Query('perPage') perPage = 5, // The value default perPage is 5
    @Query('userId') userId, // ID of Use for filter.
  ) {
    const results = await this.taskService.findAll({
      where: { responsavelId: userId }, // Filtra as tarefas pelo ID do responsável
      orderBy: { id: 'desc' }, // Ordena os registros do mais novo pro mais velho.
      page, // Número da página que será retornada o resultado Ex: 1, 2, 3...
      perPage, // Itens devolvidos por página.
    });
    return results;
  }

  @Get(':id')
  @CacheTTL(60)
  async findOne(@Param('id') id: string) {
    const task = await this.taskService.findOne(+id);
    if (!task) {
      return new NotFound();
    }
    return task;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: CreateTaskDto) {
    return this.taskService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(+id);
  }
}
