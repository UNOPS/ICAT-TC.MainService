import { Test, TestingModule } from '@nestjs/testing';
import { DataRequestService } from './data-request.service';

describe('DataRequestService', () => {
  let service: DataRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataRequestService],
    }).compile();

    service = module.get<DataRequestService>(DataRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
