import { Module } from '@nestjs/common';
import { PredictionService } from './prediction.service';
import { PredictionController } from './prediction.controller';

@Module({
  controllers: [PredictionController],
  providers: [PredictionService],
})
export class PredictionModule {}
