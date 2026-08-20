import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserResolver } from 'src/graphql/resolvers/User.resolver';
import { LeaderboardModule } from 'src/leaderboard/leaderboard.module';

@Module({
  controllers: [UsersController],
  exports: [UsersService],
  providers: [UsersService, UserResolver],
  imports: [PrismaModule, LeaderboardModule],
})
export class UsersModule {}
