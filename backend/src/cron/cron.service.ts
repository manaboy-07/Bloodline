import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PredictionService } from 'src/prediction/prediction.service';
import { PrismaService } from 'src/prisma/prisma.service';

// 1. Admin sets match status = finished
// 2. Cron detects finished + not scored
// 3. scoreMatch() runs
// 4. predictions get points
// 5. user points updated
// 6. match marked isScored = true
@Injectable()
export class CronService {
  constructor(
    private predictionService: PredictionService,
    private prisma: PrismaService,
  ) {}

  @Cron('*/2 * * * *')
  async handleCron() {
    console.log('Running scheduled job...');

    // 1. Get ONLY finished but not scored matches
    const matches = await this.prisma.match.findMany({
      where: {
        status: 'finished',
        isScored: false,
      },
    });

    // 2. Score them
    for (const match of matches) {
      await this.predictionService.scoreMatch(match.id);
    }

    // 3. Update leaderboard
    await this.predictionService.updateUserPoints();

    console.log('Cron completed');

   
  }
}
