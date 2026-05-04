import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LeaderboardService {
  constructor(private prisma: PrismaService) {}

  async getLeaderboard() {
    return await this.prisma.user.findMany({
      orderBy: { points: 'desc' },
      take: 10,
      include: { predictions: true },
    });
  }
}
