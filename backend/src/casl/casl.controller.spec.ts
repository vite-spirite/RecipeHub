import { Test, TestingModule } from '@nestjs/testing';
import { CaslController } from './casl.controller';

describe('CaslController', () => {
  let controller: CaslController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CaslController],
    }).compile();

    controller = module.get<CaslController>(CaslController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
