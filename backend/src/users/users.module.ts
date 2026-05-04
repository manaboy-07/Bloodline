import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserResolver } from 'src/graphql/resolvers/User.resolver';

@Module({
  controllers: [UsersController],
  exports: [UsersService],
  providers: [UsersService, UserResolver],
  imports: [PrismaModule],
})
export class UsersModule {}
