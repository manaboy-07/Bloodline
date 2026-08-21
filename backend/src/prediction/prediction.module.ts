import { Module } from '@nestjs/common';
import { PredictionService } from './prediction.service';
import { PredictionController } from './prediction.controller';
import { CronService } from '../cron/cron.service';
import { MatchModule } from '../match/match.module';
import { UsersModule } from '../users/users.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [PredictionController],
  providers: [PredictionService, CronService],
  exports: [PredictionService],
  imports: [PrismaModule, UsersModule, MatchModule],
})
export class PredictionModule {}
