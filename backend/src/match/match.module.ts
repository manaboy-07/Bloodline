import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { MatchResolver } from '../graphql/resolvers/Match.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [MatchController],
  providers: [MatchService, MatchResolver],
  exports: [MatchService],
  imports: [PrismaModule],
})
export class MatchModule {}
