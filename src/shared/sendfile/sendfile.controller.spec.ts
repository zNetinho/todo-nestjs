import { Test, TestingModule } from '@nestjs/testing';
import { SendfileController } from './sendfile.controller';
import { SendfileService } from './sendfile.service';

describe('SendfileController', () => {
  let controller: SendfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SendfileController],
      providers: [SendfileService],
    }).compile();

    controller = module.get<SendfileController>(SendfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
