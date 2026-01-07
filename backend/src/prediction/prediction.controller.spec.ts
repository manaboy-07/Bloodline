import { Test, TestingModule } from '@nestjs/testing';
import { PredictionController } from './prediction.controller';
import { PredictionService } from './prediction.service';

describe('PredictionController', () => {
  let controller: PredictionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PredictionController],
      providers: [PredictionService],
    }).compile();

    controller = module.get<PredictionController>(PredictionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
