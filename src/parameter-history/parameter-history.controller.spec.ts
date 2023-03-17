import { Test, TestingModule } from '@nestjs/testing';
import { ParameterHistoryController } from './parameter-history.controller';

describe('ParameterHistoryController', () => {
  let controller: ParameterHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParameterHistoryController],
    }).compile();

    controller = module.get<ParameterHistoryController>(ParameterHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
