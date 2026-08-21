import { Module } from '@nestjs/common';
import { LeaderboardResolver } from '../graphql/resolvers/Leaderboard.resolver';
import { LeaderboardService } from './leaderboard.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [LeaderboardResolver, LeaderboardService],
  exports: [LeaderboardService],
})
export class LeaderboardModule {}
