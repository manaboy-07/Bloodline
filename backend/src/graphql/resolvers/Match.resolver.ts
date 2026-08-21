import { Query, Resolver } from '@nestjs/graphql';

import { MatchModel } from '../models/matchmodel';
import { PrismaService } from '../../prisma/prisma.service';

@Resolver((of) => MatchModel)
export class MatchResolver {
  constructor(private prismaService: PrismaService) {}

  @Query(() => [MatchModel], { name: 'matches' })
  async matches() {
    return await this.prismaService.match.findMany({
      include: {
        predictions: {
          include: {
            user: true,
          },
        },
      },
    });
  }
}
