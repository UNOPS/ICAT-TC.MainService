import { Test, TestingModule } from '@nestjs/testing';
import { QualityCheckController } from './quality-check.controller';

describe('QualityCheckController', () => {
  let controller: QualityCheckController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QualityCheckController],
    }).compile();

    controller = module.get<QualityCheckController>(QualityCheckController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
