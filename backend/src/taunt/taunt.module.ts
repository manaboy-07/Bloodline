import { Module } from '@nestjs/common';
import { TauntService } from './taunt.service';
import { TauntController } from './taunt.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [TauntController],
  imports: [PrismaModule],
  exports: [TauntService],
  providers: [TauntService],
})
export class TauntModule {}
