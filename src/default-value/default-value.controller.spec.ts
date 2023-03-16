import { Test, TestingModule } from '@nestjs/testing';
import { DefaultValueController } from './default-value.controller';

describe('DefaultValueController', () => {
  let controller: DefaultValueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DefaultValueController],
    }).compile();

    controller = module.get<DefaultValueController>(DefaultValueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
