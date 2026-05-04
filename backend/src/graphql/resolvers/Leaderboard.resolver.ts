import { Query, Resolver } from '@nestjs/graphql';

import { UserModel } from '../models/usermodel';
import { LeaderboardService } from 'src/leaderboard/leaderboard.service';
import { GqlAuthGuard } from 'src/auth/guards/Gql-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver((of) => UserModel)
export class LeaderboardResolver {
  constructor(private leaderboardService: LeaderboardService) {}

  @Query(() => [UserModel], { name: 'leaderboard' })
  async leaderboard() {
    return await this.leaderboardService.getLeaderboard();
  }
}
