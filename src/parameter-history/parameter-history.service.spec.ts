import { Test, TestingModule } from '@nestjs/testing';
import { ParameterHistoryService } from './parameter-history.service';

describe('ParameterHistoryService', () => {
  let service: ParameterHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParameterHistoryService],
    }).compile();

    service = module.get<ParameterHistoryService>(ParameterHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
