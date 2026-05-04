import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MatchResolver } from 'src/graphql/resolvers/Match.resolver';

@Module({
  controllers: [MatchController],
  providers: [MatchService, MatchResolver],
  exports: [MatchService],
  imports: [PrismaModule],
})
export class MatchModule {}
