import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { TauntModule } from './taunt/taunt.module';
import { PredictionModule } from './prediction/prediction.module';
import { MatchModule } from './match/match.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron/cron.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { LeaderboardModule } from './leaderboard/leaderboard.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schema.qgl',
      context: ({ req }) => ({ req }),
    }),
    AuthModule,
    UsersModule,
    PrismaModule,
    TauntModule,
    PredictionModule,
    MatchModule,
    ScheduleModule.forRoot(),
    LeaderboardModule,
  ],
  controllers: [AppController],
  providers: [AppService, CronService],
})
export class AppModule {}
