import { Test, TestingModule } from '@nestjs/testing';
import { ReportHtmlGenaratesService } from './report-html-genarates.service';

describe('ReportHtmlGenaratesService', () => {
  let service: ReportHtmlGenaratesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportHtmlGenaratesService],
    }).compile();

    service = module.get<ReportHtmlGenaratesService>(ReportHtmlGenaratesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
