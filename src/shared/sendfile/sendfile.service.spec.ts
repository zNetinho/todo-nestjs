import { Test, TestingModule } from '@nestjs/testing';
import { SendfileService } from './sendfile.service';

describe('SendfileService', () => {
  let service: SendfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SendfileService],
    }).compile();

    service = module.get<SendfileService>(SendfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
