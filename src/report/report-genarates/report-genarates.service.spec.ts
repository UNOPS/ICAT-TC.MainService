import { Test, TestingModule } from '@nestjs/testing';
import { ReportGenaratesService } from './report-genarates.service';

describe('ReportGenaratesService', () => {
  let service: ReportGenaratesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportGenaratesService],
    }).compile();

    service = module.get<ReportGenaratesService>(ReportGenaratesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
