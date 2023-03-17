import { Test, TestingModule } from '@nestjs/testing';
import { QualityCheckService } from './quality-check.service';

describe('QualityCheckService', () => {
  let service: QualityCheckService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QualityCheckService],
    }).compile();

    service = module.get<QualityCheckService>(QualityCheckService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
