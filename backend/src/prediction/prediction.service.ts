import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePredictionDto } from './dto/create-prediction.dto';
import { UpdatePredictionDto } from './dto/update-prediction.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prediction } from 'src/generated/prisma/client';
import { MatchService } from 'src/match/match.service';
import { UsersService } from 'src/users/users.service';
import { Match } from 'src/generated/prisma/browser';

@Injectable()
export class PredictionService {
  constructor(
    private prisma: PrismaService,
    private matchService: MatchService,
    private userService: UsersService,
  ) {}

  calculatePreditcionPoints(prediction: Prediction, match: Match) {
    console.log(
      prediction.homeScore,
      prediction.awayScore,
      match.homeScore,
      match.awayScore,
    );
    const isExact =
      Number(prediction.homeScore) === Number(match.homeScore) &&
      Number(prediction.awayScore) === Number(match.awayScore);
    if (match.homeScore === null || match.awayScore === null) {
      return 0; // safer for automation you werr throwing an eerror before
    }
    if (isExact) {
      return 1;
    } else return 0;
  }
  async scoreMatch(matchId: number) {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
      include: { predictions: true },
    });

    if (!match) {
      throw new NotFoundException('Match not found');
    }
    if (match.homeScore === null || match.awayScore === null) {
      return;
    }

    if (match.isScored) {
      return;
    }
    console.log('Scoring match:', match.id);
    console.log('Predictions:', match.predictions.length);
    console.log('Match scores:', match.homeScore, match.awayScore);

    const updates = match.predictions.map((prediction) => {
      const points = this.calculatePreditcionPoints(prediction, match);

      return this.prisma.prediction.update({
        where: { id: prediction.id },
        data: { points },
      });
    });

    await this.prisma.$transaction(updates);

    // $transaction runs all queries together
    //Faster + safer (all succeed or all fail)

    // Problem
    ////If 100 users predicted → 100 DB queries
    //Slow + bad for scaling this is why we use transaction
    await this.prisma.match.update({
      where: { id: matchId },
      data: { isScored: true },
    });
  }

  //   async updateUserPoints() {
  //   const users = await this.prisma.user.findMany({
  //     include: { predictions: true },
  //   });

  //   for (const user of users) {
  //     const totalPoints = user.predictions.reduce(
  //       (sum, p) => sum + p.points,
  //       0
  //     );

  //     await this.prisma.user.update({
  //       where: { id: user.id },
  //       data: { points: totalPoints },
  //     });
  //   }
  // }
  async updateUserPoints() {
    const result = await this.prisma.prediction.groupBy({
      by: ['userId'],
      _sum: {
        points: true,
      }, //database aggregation
    });

    const updates = result.map((r) =>
      this.prisma.user.update({
        where: { id: r.userId },
        data: { points: r._sum.points || 0 },
      }),
    );

    await this.prisma.$transaction(updates);
    console.log('Points updated successfully');
    console.log(result);
  }
  //DB does the calculation → faster
  //Avoids loading everything into memory

  async create(
    awayScore: number,
    homeScore: number,
    matchId: number,
    userId: number,
  ): Promise<Prediction> {
    //does match and user exist
    const matchExist = await this.matchService.findOne(matchId);
    const userExist = await this.userService.findOne(userId);

    if (!matchExist || !userExist) {
      throw new NotFoundException('MatchID or UserID does not exist');
    }
    const now = new Date();
    if (now > matchExist.matchDate) {
      throw new ForbiddenException('Prediction is closed for this match');
    }

    try {
      return await this.prisma.prediction.create({
        data: {
          userId,
          matchId,
          awayScore,
          homeScore,
        },
        include: { match: true, user: true },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('You have already predicted this match');
      }
      throw error;
    }
  }

  async findAll(): Promise<Prediction[]> {
    return await this.prisma.prediction.findMany({
      include: { match: true, user: true },
    });
  }

  async findOne(id: number) {
    return await this.prisma.prediction.findUnique({
      where: { id },
      select: {
        id: true,
        awayScore: true,
        homeScore: true,
        match: {
          select: {
            homeTeam: true,
            awayTeam: true,
            homeScore: true,
            awayScore: true,
          },
        },
        user: { select: { name: true } },
      },
    });
  }

  async update(
    awayScore: number,
    homeScore: number,
    matchId: number,
    userId: number,
  ) {
    //find prediction based on userid and matchid
    const prediction = await this.prisma.prediction.findUnique({
      where: {
        userId_matchId: {
          userId,
          matchId,
        },
      },
      include: { match: true },
    });
    if (!prediction) {
      throw new NotFoundException('Prediction not found');
    }
    if (new Date() > prediction.match.matchDate) {
      throw new ForbiddenException('Cannot Edit match in progress');
    }
    return await this.prisma.prediction.update({
      where: {
        userId_matchId: {
          userId,
          matchId,
        },
      },
      data: {
        homeScore,
        awayScore,
      },
    });
  }

  //Get predictions by a user
  async getUserPrediction(userId: number) {
    //does user exist
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    return await this.prisma.prediction.findMany({
      where: {
        userId,
      },
      include: {
        match: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getMatchPrediction(matchId: number) {
    if (!matchId || isNaN(matchId)) {
      throw new BadRequestException('Invalid matchId');
    }

    const match = await this.matchService.findOne(matchId);

    if (!match) {
      throw new NotFoundException('Match does not exist');
    }

    const predictions = await this.prisma.prediction.findMany({
      where: { matchId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return predictions;
  }

  async deletePrediction(userId: number, matchId: number) {
    return await this.prisma.prediction.delete({
      where: {
        userId_matchId: {
          userId,
          matchId,
        },
      },
    });
  }
}
