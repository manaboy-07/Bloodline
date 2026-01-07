import { Module } from '@nestjs/common';
import { TauntService } from './taunt.service';
import { TauntController } from './taunt.controller';

@Module({
  controllers: [TauntController],
  providers: [TauntService],
})
export class TauntModule {}
