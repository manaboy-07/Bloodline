import { Test, TestingModule } from '@nestjs/testing';
import { TauntController } from './taunt.controller';
import { TauntService } from './taunt.service';

describe('TauntController', () => {
  let controller: TauntController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TauntController],
      providers: [TauntService],
    }).compile();

    controller = module.get<TauntController>(TauntController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
