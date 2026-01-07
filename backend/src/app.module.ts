import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { TauntModule } from './taunt/taunt.module';
import { PredictionModule } from './prediction/prediction.module';
import { MatchModule } from './match/match.module';

@Module({
  imports: [AuthModule, UsersModule, PrismaModule, TauntModule, PredictionModule, MatchModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
