import { Test, TestingModule } from '@nestjs/testing';
import { AssessmentPagesService } from './assessment-pages.service';

describe('AssessmentPagesService', () => {
  let service: AssessmentPagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssessmentPagesService],
    }).compile();

    service = module.get<AssessmentPagesService>(AssessmentPagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
