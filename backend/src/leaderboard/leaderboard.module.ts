import { Module } from '@nestjs/common';
import { LeaderboardResolver } from 'src/graphql/resolvers/Leaderboard.resolver';
import { LeaderboardService } from './leaderboard.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [LeaderboardResolver, LeaderboardService],
})
export class LeaderboardModule {}
