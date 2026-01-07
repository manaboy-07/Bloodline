import { Test, TestingModule } from '@nestjs/testing';
import { TauntService } from './taunt.service';

describe('TauntService', () => {
  let service: TauntService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TauntService],
    }).compile();

    service = module.get<TauntService>(TauntService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
