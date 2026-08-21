import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserModel } from '../models/usermodel';
import { Context } from '@nestjs/graphql';

import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/guards/Gql-auth.guard';

@Resolver((of) => UserModel)
export class UserResolver {
  constructor(private prismaService: PrismaService) {}
  @UseGuards(GqlAuthGuard)
  @Query(() => UserModel, { name: 'userDashboard' })
  async userDashboard(@Context() context) {
    const userId = context.req.user?.id;

    return await this.prismaService.user.findUnique({
      where: { id: userId },
      include: {
        predictions: {
          include: {
            match: true,
          },
        },
      },
    });
  }
}
