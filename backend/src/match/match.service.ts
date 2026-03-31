import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Match, Prisma } from 'src/generated/prisma/client';

@Injectable()
export class MatchService {
  constructor(private prisma: PrismaService ){}

  async create(createMatchDto: CreateMatchDto): Promise<Match> {
    if(createMatchDto.awayTeam === createMatchDto.homeTeam){
      throw new BadRequestException('Home team and away team cannot be the same')
    }
    return await this.prisma.match.create({
      data: {
        awayTeam: createMatchDto.awayTeam,
        homeTeam: createMatchDto.homeTeam,
        matchDate: new Date(createMatchDto.matchDate)
      },
      include: {predictions: true}
    })
  }

  async findAll(): Promise<Match[]> {
    return this.prisma.match.findMany({
      include: { predictions: true}
    })
  }

  async findOne(id: number) {
    return await this.prisma.match.findUnique({
      where: {id},
      select: {
        id: true,
        awayScore: true,
        homeScore: true,
        status: true,
        awayTeam: true,
        matchDate: true,
        homeTeam: true,
        predictions: {select: {userId: true, matchId: true}}
      }
    })
  }

  async update(id: number, data: Prisma.MatchUpdateInput): Promise<Match> {
    return await this.prisma.match.update({
      where: {id},
      data
    })
  }

  async deleteMatch(id: number) {
    return await this.prisma.match.delete({where: {id}})
  }
}
