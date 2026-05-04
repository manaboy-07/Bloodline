import { Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { MatchModel } from '../models/matchmodel';

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
