import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePredictionDto } from './dto/create-prediction.dto';
import { UpdatePredictionDto } from './dto/update-prediction.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prediction } from 'src/generated/prisma/client';
import { MatchService } from 'src/match/match.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PredictionService {
  constructor (private prisma: PrismaService, private matchService: MatchService, private userService: UsersService ){}
  async create(
    awayScore: number, homeScore: number, matchId: number, userId: number
  ): Promise<Prediction> {

    //does match and user exist 
    const matchExist = await this.matchService.findOne(matchId)
    const userExist = await this.userService.findOne(userId)

    if(!matchExist || !userExist){
      throw new NotFoundException("MatchID or UserID does not exist")
    }
    if(new Date() > matchExist.matchDate){
      throw new ForbiddenException('Prediction is closed for this match')
    }

    try {
      return await this.prisma.prediction.create({
      data: {
        userId,
        matchId,
        awayScore,
        homeScore
      },
      include: {match: true, user: true}
    })
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'You have already predicted this match',
        );
      }
      throw error;
    }
  }

  async findAll(): Promise<Prediction[]> {
    return await this.prisma.prediction.findMany({
      include: {match: true, user: true}
    })
  }

  async findOne(id: number) {
    return await this.prisma.prediction.findUnique({
      where: {id},
      select: {
        id: true,
        awayScore: true,
        homeScore: true,
        match: {select: {homeTeam: true, awayTeam: true, homeScore: true, awayScore: true}},
        user: {select: {name: true}}
      }
    })
  }

  async update(id: number, awayScore: number, homeScore: number, matchId: number, userId: number) {
    //find prediction based on userid and matchid
    const prediction = await this.prisma.prediction.findUnique({
      where: {
        id,
        userId_matchId: {
          userId,
          matchId
        },
        
      },
      include: {match: true}
    })
    if(!prediction){
      throw new NotFoundException("Prediction not found")
    }
    if(new Date() > prediction.match.matchDate){
      throw new ForbiddenException('Cannot Edit match in progress')
    }
    return await this.prisma.prediction.update({
      where: {
        id,
        userId_matchId:{
          userId,
          matchId
        },
      },
      data: {
        homeScore,
        awayScore
      }
    })
    
  }

  
  //Get predictions by a user
  async getUserPrediction(userId: number){
    //does user exist
    const user = await this.userService.findOne(userId)
    if(!user){
      throw new NotFoundException('User does not exist')
    }
    return await this.prisma.prediction.findMany({
      where:{
        userId
      },
      include: {
        match: true,

      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  async getMatchPrediction(matchId: number){
    const match = await this.matchService.findOne(matchId)
    if(!match){
      throw new NotFoundException('Match does not exist')
    }
    return await this.prisma.prediction.findMany({
      where: {
        matchId
      },
      include: {
        user: true
      },
    })
  }
  

  async deletePrediction(id: number, userId:number, matchId: number) {
    return await this.prisma.prediction.delete({
      where: {
        id,
        userId_matchId: {
          userId,
          matchId
        }
      }
    })
  }
}
