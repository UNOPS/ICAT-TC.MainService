import { Test, TestingModule } from '@nestjs/testing';
import { ReportPagesService } from './report-pages.service';

describe('ReportPagesService', () => {
  let service: ReportPagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportPagesService],
    }).compile();

    service = module.get<ReportPagesService>(ReportPagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
