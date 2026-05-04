import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTauntDto } from './dto/create-taunt.dto';
import { UpdateTauntDto } from './dto/update-taunt.dto';
import { PrismaService } from 'src/prisma/prisma.service';

import { Taunt, Prisma } from 'src/generated/prisma/client';

@Injectable()
export class TauntService {
  constructor (private prisma: PrismaService){}

  async create(createTauntDto: CreateTauntDto, userId: number) {
    const { message } = createTauntDto
    if(message === ""){
       throw new BadRequestException("Message cannot be empty")
    }
    
    return await this.prisma.taunt.create({
      data: {
        message,
        userId
      }
    }) 
  }

  async findAll(): Promise<Taunt[]> {
    return await this.prisma.taunt.findMany({
      include: {user: true}
    })
  }

  async findOne(id: number) {
    return await this.prisma.taunt.findUnique({
      where: {id},
      select: {
        message: true,
        user: true
      }
    })//may not include userr here
  }
  
async findUserTaunt(userId: number) {
  if (!userId) {
    throw new NotFoundException("UserId not provided");
  }
  //sinc a user cna have many taunts
  const taunts = await this.prisma.taunt.findMany({
    where: { userId },
    select: {
      message: true,
      user: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return taunts;
}
  async update(id: number, data: Prisma.TauntUpdateInput) {
    return await this.prisma.taunt.update({
      where: {id},
      data
    })
  }

  async delete(id: number) {
    return await this.prisma.taunt.delete({where: {id}})
  }
}
