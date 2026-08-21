import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserResolver } from '../graphql/resolvers/User.resolver';
import { LeaderboardModule } from '../leaderboard/leaderboard.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [UsersController],
  exports: [UsersService],
  providers: [UsersService, UserResolver],
  imports: [PrismaModule, LeaderboardModule],
})
export class UsersModule {}
