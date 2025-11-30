import { Test } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UserService } from '../user/user.service';
import { task_status } from '@prisma/client';
import MockDate from 'mockdate'


describe('TaskController', () => {
  let taskController: TaskController;
  let taskService: TaskService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    task: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  const mockTaskService = {
    // Aqui podemos adicionar os serviços se necessário
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
        { provide: TaskService, useValue: mockTaskService },
      ],
    }).compile();

    taskService = moduleRef.get<TaskService>(TaskService);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
    taskController = moduleRef.get<TaskController>(TaskController);
  });

  describe('findAll', () => {
    it('Deve retornar um array de tarefas', async () => {
      jest.spyOn(taskService, 'findAll').mockImplementation(async () => ({
        data: [],
        meta: {
          totalItems: 0,
          itemCount: 0,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1,
        },
      }));

      const result = await taskController.findAll(1, 5, null);
      expect(result).toEqual({
        data: [],
        meta: {
          totalItems: 0,
          itemCount: 0,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1,
        },
      });
    });
  });

  describe('findOne', () => {
    it('Deve retornar uma tarefa', async () => {
      const mockTask = {
        id: 1,
        nome: 'Tarefa 1',
        objetivo: 'Objetivo da tarefa 1',
        status: 'BACKLOG' as task_status,
        responsavelId: '1',
        concluido: false,
        criado_em: new Date().toISOString(),
        alterado_em: new Date().toISOString(),
        responsavel: {
          id: 1,
          nome: 'Usuário 1',
        },
      };
  
      jest.spyOn(taskService, 'findOne').mockResolvedValue(mockTask);
  
      const result = await taskController.findOne('1');
  
      expect(result).toEqual(mockTask);
    });
  });

  describe('create', () => {

    beforeAll(() => {
      MockDate.set('2025-02-10T03:31:31.248Z');
    });
  
    afterAll(() => {
      MockDate.reset();
    });

    it('Deve criar uma nova tarefa', async () => {
      const mockTask = {
        id: 1,
        nome: 'Tarefa 1',
        objetivo: 'Objetivo da tarefa 1',
        status: 'BACKLOG' as task_status,
        responsavelId: '1',
        concluido: false,
        criado_em: new Date().toISOString(),
        alterado_em: new Date().toISOString(),
        responsavel: {
          id: 1,
          nome: 'Usuário 1',
        },
      };
    
      jest.spyOn(taskService, 'create').mockResolvedValue(mockTask);
    
      const result = await taskController.create({
        nome: 'Tarefa 1',
        objetivo: 'Objetivo da tarefa 1',
        responsavelId: '1',
      });
    
      expect(result).toEqual(mockTask); // Remove o "data" e compara diretamente com o objeto
    });
    
  });
  
  // describe('remove', () => {

  //   beforeAll(() => {
  //     MockDate.set('2025-02-10T03:31:31.248Z');
  //   });
  
  //   afterAll(() => {
  //     MockDate.reset();
  //   });

  //   it('Deve remover uma tarefa', async () => {
  //     const id = 1;
  //     const mockTaskExclude = {
  //       message: ",",
  //       id: 1,
  //       nome: 'Tarefa 1',
  //       objetivo: 'Objetivo da tarefa 1',
  //       status: 'BACKLOG' as task_status,
  //       responsavelId: '1',
  //       concluido: false,
  //       criado_em: new Date().toISOString(),
  //       alterado_em: new Date().toISOString(),
  //       responsavel: {
  //         id: 1,
  //         nome: 'Usuário 1',
  //       },
  //     }
      
      
  //     const result = { message: 'Tarefa removida com sucesso.', mockTaskExclude}
  //     const taskExclude = await taskService.remove(id)
  //     const objeto = { message: 'Tarefa removida com sucesso.', mockTaskExclude: { taskExclude }}
  //     jest.spyOn(taskService, 'remove').mockResolvedValue(objeto);
  //     expect(result).toEqual(objeto);
  //   })
  // });

});
