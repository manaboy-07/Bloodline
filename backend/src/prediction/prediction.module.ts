import { Module } from '@nestjs/common';
import { PredictionService } from './prediction.service';
import { PredictionController } from './prediction.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { MatchModule } from 'src/match/match.module';

@Module({
  controllers: [PredictionController],
  providers: [PredictionService],
  exports: [PredictionService],
  imports: [PrismaModule, UsersModule, MatchModule]
})
export class PredictionModule {}
