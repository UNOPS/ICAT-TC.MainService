import { Test, TestingModule } from '@nestjs/testing';
import { DataRequestController } from './data-request.controller';

describe('DataRequestController', () => {
  let controller: DataRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataRequestController],
    }).compile();

    controller = module.get<DataRequestController>(DataRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
